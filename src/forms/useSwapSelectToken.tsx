import { useEffect, useMemo, useState } from "react"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"
import SwapSelectToken from "./SwapSelectToken"
import usePairs, { lpTokenInfos, Pair, tokenInfos } from "../rest/usePairs"
import { Type } from "pages/Swap"

export interface Config {
  /** Current value */
  value: string
  symbol: string
  /** Function to call when a value is selected */
  onSelect: (asset: string, isUnable?: boolean) => void
  /** Key of price to show from data */
  priceKey?: PriceKey
  /** Key of balance to show from data */
  balanceKey?: BalanceKey
  /** Include UST in the list */
  useUST?: boolean
  /** Exclude symbol in the list */
  skip?: string[]
  /** Modify token name */
  formatTokenName?: (symbol: string) => string
  isFrom: boolean
  oppositeValue: string
  onSelectOpposite: (symbol: string) => void
}

export type SwapTokenAsset = {
  symbol: string
  name: string
  contract_addr: string
  icon: string[]
  verified: boolean
  isUnable: boolean
}

const removeDuplicatesFilter = (
  value: string,
  index: number,
  array: string[]
) => array.indexOf(value) === index

export default (config: Config, type: string) => {											  
  const { isLoading: isPairLoading } = usePairs()

  const {
    value: selected,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbol,
    onSelect,
    isFrom,
    oppositeValue,
  } = config
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => (isOpen ? handleSelect(selected) : setIsOpen(!isOpen))

 /* select asset */
  const handleSelect = (asset: string, isUnable?: boolean) => {
    setIsOpen(false)
  }

  const select = { ...config, isOpen, asset: selected, type, onClick: toggle }

  const [addressList, setAddressList] = useState<string[]>([])
  const [availableAddressList, setAvailableAddressList] = useState<string[]>()

  const assetList = useMemo<SwapTokenAsset[] | undefined>(() => {
    if (!availableAddressList || !addressList) {
      return undefined
    }
    return [...availableAddressList, ...addressList]
      .filter(removeDuplicatesFilter)
      .sort((a, b) => {
        const vA = tokenInfos.get(a)?.verified
        const vB = tokenInfos.get(b)?.verified

        return vA && vB ? 0 : vB === true ? 1 : vA === true ? -1 : 0
      })
      .map((item) => {
        const isUnable = !availableAddressList?.includes(item)

        if (type === Type.WITHDRAW) {
          const tokenInfoList = lpTokenInfos.get(item)
          return {
            symbol: tokenInfoList
              ? tokenInfoList[0].symbol + "-" + tokenInfoList[1].symbol
              : "",
            name: "",
            contract_addr: item,
            icon: tokenInfoList
              ? [tokenInfoList[0].icon, tokenInfoList[1].icon]
              : ["", ""],
            verified: false,
            isUnable,
          }
        }

        const tokenInfo = tokenInfos.get(item)
        return {
          symbol: tokenInfo?.symbol || "",
          name: tokenInfo?.name || "",
          contract_addr: item,
          icon: [tokenInfo ? tokenInfo.icon : ""],
          verified: tokenInfo?.verified || false,
          isUnable,
        }
      })
      .filter((item) => !!item?.symbol) as SwapTokenAsset[]
  }, [addressList, availableAddressList, type])

  return {
    isOpen,
    button: <SwapSelectToken {...select} />,
    assets: ""
  }
 
}
