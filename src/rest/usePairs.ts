import { useCallback, useEffect, useMemo, useState } from "react"
import {
  KRT,
  LUNA,
  MNT,
  SDT,
  UKRW,
  ULUNA,
  UMNT,
  UST,
  UUSD,
  USDR,
  AUT,
  CAT,
  CHT,
  CNT,
  EUT,
  GBT,
  HKT,
  INT,
  JPT,
  SGT,
  THT,
  UAUD,
  UCAD,
  UCHF,
  UCNY,
  UEUR,
  UGBP,
  UHKD,
  UINR,
  UJPY,
  USGD,
  UTHB,
} from "constants/constants"
import useAPI, { ApiVersion } from "./useAPI"
import { useNetwork } from "hooks"
import mainnetTokens from "constants/mainnet-tokens.json"
import testnetTokens from "constants/testnet-tokens.json"

interface Pairs {
  pairs: Pair[]
}

export interface Pair {
  pair: TokenInfo[]
  contract: string
  liquidity_token: string
}

interface TokenInfo {
  symbol: string
  name: string
  contract_addr: string
  decimals: number
  icon: string
  verified: boolean
}

interface PairsResult {
  pairs: PairResult[]
}

interface PairResult {
  liquidity_token: string
  contract_addr: string
  asset_infos: (NativeInfo | AssetInfo)[]
}

interface TokenResult {
  name: string
  symbol: string
  decimals: number
  total_supply: string
  contract_addr: string
  icon: string
  verified: boolean
}

export let tokenInfos: Map<string, TokenInfo> = new Map<string, TokenInfo>([
  [
    LUNA,
    {
      contract_addr: ULUNA,
      symbol: "LUNC",
      name: ULUNA,
      decimals: 6,
      icon: "https://raw.githubusercontent.com/terra-money/assets/master/icon/svg/LUNC.svg",
      verified: true,
    },
  ],
])

tokenInfos.set("terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m", {
  name: "Burn and Stake Enterprise Token",
  symbol: "BASE",
  decimals: 6,
  contract_addr: "terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m",
  icon: "https://raw.githubusercontent.com/lbunproject/BASEswap-web-app_Classic/main/src/images/Token/LBUNC.svg",
  verified: true,
})

export let lpTokenInfos: Map<string, TokenInfo[]> = new Map<
  string,
  TokenInfo[]
>()

export let InitLP = ""

const usePairs = (apiVersion?: ApiVersion) => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Pairs>({ pairs: [] })
  const { loadPairs, loadTokenInfo, loadTokensInfo } = useAPI(apiVersion)
  const { name: networkName } = useNetwork()
  const [currentNetworkName, setCurrentNetworkName] = useState("")

  const getTokenInfo = useCallback(
    async (info: NativeInfo | AssetInfo) => {
      let tokenInfo: TokenInfo | undefined
      if (isAssetInfo(info)) {
        tokenInfo = tokenInfos.get(info.token.contract_addr)
        if (!tokenInfo) {
          const tokenResult: TokenResult | undefined = await loadTokenInfo(
            info.token.contract_addr
          )
          tokenInfo = {
            symbol: "",
            name: "",
            contract_addr: info.token.contract_addr,
            decimals: 6,
            icon: "",
            verified: false,
          }
          if (tokenResult) {
            tokenInfo = {
              symbol: tokenResult.symbol,
              name: tokenResult.name,
              contract_addr: info.token.contract_addr,
              decimals: tokenResult.decimals,
              icon: tokenResult.icon,
              verified: tokenResult.verified,
            }
          }
          tokenInfos.set(info.token.contract_addr, tokenInfo)
        }
      } else if (isNativeInfo(info)) {
        tokenInfo = tokenInfos.get(info.native_token.denom)
      }

      return tokenInfo
    },
    [loadTokenInfo]
  )

  useEffect(() => {
    return undefined
  }, [
    currentNetworkName,
    getTokenInfo,
    isLoading,
    loadPairs,
    loadTokensInfo,
    networkName,
    result,
  ])

  return { ...result, isLoading, getTokenInfo }
}

export default usePairs

export const useTokenInfos = () => {
  const { isLoading: isPairsLoading } = usePairs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const res = useMemo(() => new Map(tokenInfos), [isPairsLoading])
  return res
}

export const useLpTokenInfos = () => {
  const { isLoading: isPairsLoading } = usePairs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const res = useMemo(() => new Map(lpTokenInfos), [isPairsLoading])
  return res
}

export function isAssetInfo(object: any): object is AssetInfo {
  return "token" in object
}

export function isNativeInfo(object: any): object is NativeInfo {
  return "native_token" in object
}
