import { NetworkInfo, useWallet } from "@terra-money/wallet-provider"
import {
  FC,
  PropsWithChildren,
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import Container from "./Container"
import styles from "./SwapPage.module.scss"
import Summary from "../pages/Dashboard/Summary"


interface Props {
  title?: ReactNode
  description?: ReactNode
  sm?: boolean
  autoRefreshTicker?: boolean
}

const Page: FC<PropsWithChildren<Props>> = ({
  title,
  description,
  children,
  ...props
}) => {
  const { sm } = props

  const lastNetworkRef = useRef<NetworkInfo>()
  const { network } = useWallet()
  const [searchParams, setSearchParams] = useSearchParams()

  let [luna1Price, setLuna1Price] = useState(0)
  let [luna2Price, setLuna2Price] = useState(0)
  let [btcPrice, setBtcPrice] = useState(0)
  const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)
  // From api to smart contract
  let [currentSupply, setCurrentSupply] = useState(0);
  let [currentPrice, setCurrentPrice] = useState(0);
  let [currentReserve, setCurrentReserve] = useState(0);
  let [taxCollected, setTaxCollected] = useState(0);

  useLayoutEffect(() => {
    const timerId = setTimeout(() => {
      if (
        network &&
        lastNetworkRef.current &&
        network?.name !== lastNetworkRef.current?.name &&
        window.location.pathname.includes("/swap") &&
        searchParams &&
        setSearchParams
      ) {
        searchParams.set("from", "")
        searchParams.set("to", "")
        setSearchParams(searchParams, { replace: true })
      }
      lastNetworkRef.current = network
    }, 10)

    return () => {
      clearTimeout(timerId)
    }
    // #112: Do not add searchParams, setSearchParams to deps for performance reasons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  useEffect(() => {
    const timerId = setInterval(() => {
      if (
        window?.navigator?.onLine &&
        window?.document?.hasFocus()
      ) {
        setAutoRefreshTicker((current) => !current)
      }
    }, 30000)
    return () => {
      clearInterval(timerId)
    }
  }, [])


  useEffect(() => {

    const url1 = 'https://lcd-terra.synergynodes.com/wasm/contracts/terra14tfl8s9ag200r5slncgyzqv9dyq3dl0zu73afg/store?query_msg=%7B%22curve_info%22:%7B%7D%7D'
    fetch(url1)
        .then(response => response.text())
        .then(text => {
            console.log(text);
            const tbcData = JSON.parse(text);
            setCurrentSupply(Number(tbcData.result.supply)/1000000);
            setCurrentPrice(Number(tbcData.result.spot_price)/1000000);
            setCurrentReserve(Number(tbcData.result.reserve)/1000000);
            setTaxCollected(Number(tbcData.result.tax_collected)/1000000);
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

    const url3 =
      "https://api.coingecko.com/api/v3/simple/price?ids=terra-luna-2&vs_currencies=usd"
    fetch(url3)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const apiCoinGeckoLunc = JSON.parse(text)
        setLuna2Price(Number(apiCoinGeckoLunc["terra-luna-2"]["usd"]))
      })

      const url4 =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    fetch(url4)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const apiCoinGeckobtc= JSON.parse(text)
        setBtcPrice(Number(apiCoinGeckobtc["bitcoin"]["usd"]))
      })

    return
  }, [autoRefreshTicker])

  return (
     <article className={styles.article}>
      <Summary 
        data={[
          {
            label: "BASE / LUNC",
            value: (currentPrice).toString(),
            isCurrency: false,
            decimals: 6,
          },
          {
            label: "BASE Supply",
            value: currentSupply.toString(),
            isCurrency: false,
            decimals: 1,
          }, 
          {
            label: "LUNC Liquidity",
            value: currentReserve.toString(),
            isCurrency: false,
            decimals: 0,
          },
          {
            label: "BASE / USD",
            value: ((currentPrice) * luna1Price).toString(),
            isCurrency: true,
            decimals: 6,
          },          {
            label: "LUNC / USD",
            value: luna1Price.toString(),
            isCurrency: true,
            decimals: 6,
          },
        ]}
      />
      
      <br></br>
      <br></br>

      {sm ? <Container sm>{children}</Container> : children}
    </article>
  )
}

export default Page


