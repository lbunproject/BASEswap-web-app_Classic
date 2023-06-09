import { useWallet } from "@terra-money/wallet-provider"
import { FINDER } from "constants/constants"
import networks from "constants/networks"

const useNetwork = () => {
  const { network: extNetwork } = useWallet()

  const network = networks[extNetwork.name]

  const finder = (address: string, path: string = "account") =>
    `${FINDER}/${path}/${address}`


  return { ...extNetwork, ...network, finder }
}

export default useNetwork
