import { Int, MsgExecuteContract } from "@terra-money/terra.js"
import { useAddress } from "hooks"
import { div, floor, times } from "libs/math"
import { toAmount } from "libs/parse"
import { Type } from "pages/Swap"
import { useEffect, useMemo, useState } from "react"
import { tokenInfos } from "./usePairs"

// Create an array of points on the graph
const SIGMOID_CURVE = [
  { supply: 0, spot_price: 0, reserve: 0 },
  { supply: 10000000, spot_price: 0.1, reserve: 500000 },
  { supply: 19999000, spot_price: 0.2, reserve: 1999850 },
  { supply: 20000000, spot_price: 80, reserve: 2039950 },
  { supply: 25000000, spot_price: 120, reserve: 502039950 },
  { supply: 30000000, spot_price: 180, reserve: 1252039950 },
  { supply: 32000000, spot_price: 280, reserve: 1712039950 },
  { supply: 34000000, spot_price: 378, reserve: 2370039950 },
  { supply: 36000000, spot_price: 504, reserve: 3252039950 },
  { supply: 38000000, spot_price: 651, reserve: 4407039950 },
  { supply: 40000000, spot_price: 1000, reserve: 6058039950 },
  { supply: 42000000, spot_price: 1500, reserve: 8558039950 },
  { supply: 45000000, spot_price: 2500, reserve: 14558039950 },
  { supply: 47500000, spot_price: 4000, reserve: 22683039950 },
  { supply: 58000000, spot_price: 15000, reserve: 122433039950 },
  { supply: 61000000, spot_price: 18000, reserve: 171933039950 },
  { supply: 65000000, spot_price: 22000, reserve: 251933039950 },
  { supply: 69000000, spot_price: 25000, reserve: 345933039950 },
  { supply: 74000000, spot_price: 27500, reserve: 477183039950 },
  { supply: 80000000, spot_price: 29500, reserve: 648183039950 },
  { supply: 87000000, spot_price: 31000, reserve: 859933039950 },
  { supply: 95000000, spot_price: 32000, reserve: 1111933039950 },
  { supply: 100000000, spot_price: 32500, reserve: 1273183039950 },
  { supply: 110000000, spot_price: 33000, reserve: 1600683039950 },
  { supply: 150000000, spot_price: 33500, reserve: 2930683039950 },
  { supply: 200000000, spot_price: 34000, reserve: 4618183039950 },
]

type Params = {
  from: string
  to: string
  amount: number | string
  type?: Type
  affiliate?: string
  slippageTolerance?: string | number
}

const useTBC = (params: Params) => {
  const walletAddress = useAddress()
  const {
    from,
    to,
    type,
    amount: _amount,
    affiliate,
    slippageTolerance,
  } = params
  const amount = Number(_amount)
  const debouncedAmount = useDebounce(amount, 500)
  const [isLoading, setIsLoading] = useState(false)
  const [msgs, setMsgs] = useState<
    (MsgExecuteContract[] | MsgExecuteContract)[]
  >([])
  const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)
  const [simulatedAmounts, setSimulatedAmounts] = useState<number[]>([])

  // From api to smart contract
  let [currentSupply, setCurrentSupply] = useState(0)
  let [currentPrice, setCurrentPrice] = useState(0)
  let [currentReserve, setCurrentReserve] = useState(0)
  let [taxCollected, setTaxCollected] = useState(0)
  let [luna1Price, setLuna1Price] = useState(0)

  let currentMarketCap = 0
  const tokenInfo = tokenInfos.get(to)

  // Will calculate new values
  let tokensToMint = 0
  let reserveReturned = 0
  let newMarketCap = 0

  const profitableQuery = useMemo(() => {
    let luncUsdPrice = 0
    let luncLbunPrice = 0
    let coinDeposit = 0
    let coinDebit = 0
    let msg = undefined

    let newReserve
    let newSupply
    let newPrice
    let simulatedAmount = 0
    let rate = 0

    setIsLoading(true)
    if (!to || !debouncedAmount) {
      return undefined
    } else if (from === "uluna") {
      const taxPercentage = 0.048
      let index = 0
      coinDeposit = debouncedAmount * (1 - (taxPercentage + 0.005))
      newReserve = currentReserve + coinDeposit

      if (
        newReserve == 0 ||
        newReserve > SIGMOID_CURVE[SIGMOID_CURVE.length - 1].reserve
      ) {
        return undefined
      }

      for (let i = 0; i < SIGMOID_CURVE.length; i++) {
        if (
          newReserve > SIGMOID_CURVE[i].reserve &&
          newReserve <= SIGMOID_CURVE[i + 1].reserve
        ) {
          index = i
          break
        }
      }

      //Shift to zero
      let virtualReserve = newReserve - SIGMOID_CURVE[index].reserve

      //Calc slope of line
      let slope =
        (SIGMOID_CURVE[index + 1].spot_price -
          SIGMOID_CURVE[index].spot_price) /
        (SIGMOID_CURVE[index + 1].supply - SIGMOID_CURVE[index].supply)

      /*https://www.wolframalpha.com/input?i=R+%3D+L*S+%2B+.5*%28U-L%29S+%3B++++solve+for+R*/
      //calc lower and upper y values
      let lower = SIGMOID_CURVE[index].spot_price
      let upper = Math.sqrt(lower ** 2 + 2 * slope * virtualReserve)

      //calc supply from reserve
      let virtualSupply = (2 * virtualReserve) / (lower + upper)

      //Shift back
      let realSupply = virtualSupply + SIGMOID_CURVE[index].supply

      //tokens to mint depends on whether currentSupply is within current SIGMOID_CURVE bracket
      let tokensToMint = realSupply - currentSupply

      simulatedAmount = Math.floor(tokensToMint * 1000000) //cuz 6 decimals
      simulatedAmount = simulatedAmount < 0 ? 0 : simulatedAmount

      rate = debouncedAmount / tokensToMint
      rate = rate < 0 ? 0 : rate

      let spot_price = slope * virtualSupply + SIGMOID_CURVE[index].spot_price

      const buyAmount = Math.floor(debouncedAmount * 1000000) //cuz 6 decimals

      const executeMsg = {
        buy: {
          affiliate: btoa(`${affiliate}`),
        },
      }

      msg = new MsgExecuteContract(
        walletAddress,
        "terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m",
        executeMsg,
        { uluna: buyAmount.toString() }
      )
    } else if (from === "terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m") {
      const taxPercentage = 0.048
      let index = 0
      coinDebit = debouncedAmount
      newSupply = currentSupply - coinDebit //this is BASE

      //newSupply calculation
      if (
        newSupply < 0 ||
        newSupply > SIGMOID_CURVE[SIGMOID_CURVE.length - 1].supply
      ) {
        return undefined
      }

      for (let i = 0; i < SIGMOID_CURVE.length; i++) {
        if (
          newSupply > SIGMOID_CURVE[i].supply &&
          newSupply <= SIGMOID_CURVE[i + 1].supply
        ) {
          index = i
          break
        }
      }

      //Shift to zero
      let virtual_supply = newSupply - SIGMOID_CURVE[index].supply

      //Calc slope of line
      let slope =
        (SIGMOID_CURVE[index + 1].spot_price -
          SIGMOID_CURVE[index].spot_price) /
        (SIGMOID_CURVE[index + 1].supply - SIGMOID_CURVE[index].supply)

      /*https://www.wolframalpha.com/input?i=R+%3D+L*S+%2B+.5*%28U-L%29S+%3B++++solve+for+S*/
      //calc lower and upper y values
      let lower = SIGMOID_CURVE[index].spot_price
      let upper = slope * virtual_supply + lower

      //calc reserve from supply
      let virtual_reserve = (virtual_supply * (lower + upper)) / 2

      //Shift back
      let newReserve = virtual_reserve + SIGMOID_CURVE[index].reserve

      //Subtract to get reserve difference
      let reserveDelta = currentReserve - newReserve

      //subtract tax
      let reserveReturned = reserveDelta * (1 - taxPercentage)

      //Convert to Uint128
      simulatedAmount = reserveReturned * 1000000 //cuz 6 decimals
      simulatedAmount = simulatedAmount < 0 ? 0 : simulatedAmount

      //cal Ave rate for this order
      rate = reserveReturned / coinDebit
      rate = rate < 0 ? 0 : rate

      const burnAmount = parseFloat(`${coinDebit}`) * 1000000
      msg = new MsgExecuteContract(
        walletAddress, //sender
        "terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m", //BASE TBC contract
        { burn: { amount: burnAmount.toString() } } // execute msg for handle msg
      )
    } else {
      return undefined
    }

    luncUsdPrice = luna1Price
    luncLbunPrice = rate

    const tokenRoutes: string[] = []
    setIsLoading(false)
    return {
      msg,
      luncUsdPrice,
      luncLbunPrice: luncLbunPrice.toString(),
      simulatedAmount,
      tokenRoutes,
      price: rate.toString(),
      //currentSupply,
      //currentReserve,
      //currentPrice
    }
  }, [to, debouncedAmount, msgs, simulatedAmounts]) //end of useMemo

  useEffect(() => {
    const url =
      "https://lcd-terra.synergynodes.com/cosmwasm/wasm/v1/contract/terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m/smart/eyJjdXJ2ZV9pbmZvIjp7fX0="
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const tbcData = JSON.parse(text)
        setCurrentSupply(Number(tbcData.data.supply) / 1000000)
        setCurrentPrice(Number(tbcData.data.spot_price * 1.053) / 1000000)
        setCurrentReserve(Number(tbcData.data.reserve) / 1000000)
        setTaxCollected(Number(tbcData.data.tax_collected) / 1000000)
      })

    const url2 =
      "https://api.coingecko.com/api/v3/simple/price?ids=terra-luna&vs_currencies=usd"
    fetch(url2)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const apiCoinGeckoLuna = JSON.parse(text)
        setLuna1Price(Number(apiCoinGeckoLuna["terra-luna"]["usd"]))
      })
    return
  }, [debouncedAmount, from, to, type, isLoading])

  useEffect(() => {
    const timerId = setInterval(() => {
      setAutoRefreshTicker((current) => !current)
    }, 30000)
    return () => {
      clearInterval(timerId)
    }
  }, [debouncedAmount, from])

  const result = useMemo(() => {
    if (!from || !to || !type || !debouncedAmount) {
      return { profitableQuery: undefined, isLoading: false }
    }
    return {
      isLoading,
      profitableQuery,
    }
  }, [debouncedAmount, from, isLoading, profitableQuery, to, type])

  return result
}

// Generic deBounce Hook ( https://usehooks.com/useDebounce/ )
function useDebounce(value: number, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export default useTBC
