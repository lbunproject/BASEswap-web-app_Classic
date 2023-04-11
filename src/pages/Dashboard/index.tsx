import { useState, useMemo, ReactElement, useEffect } from "react"
import styled from "styled-components"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

import useDashboardAPI from "rest/useDashboardAPI"
import { formatMoney, lookup } from "libs/parse"

import Chart from "components/Chart"
import Card from "components/Card"
import List from "components/List"
import Input from "components/Input"
import Table from "components/Table"
import AssetIcon from "components/AssetIcon"
import Select from "components/Select"
import container from "components/Container"

import Summary from "./Summary"
import { Data } from "./Data"
import LatestBlock from "components/LatestBlock"
import Tooltip from "components/Tooltip"
import Loading from "components/Loading"
import { UST } from "constants/constants"

import AboutWebsiteMain from "components/AboutWebsiteMain"
import AboutWebsiteHeader from "components/AboutWebsiteHeader"

const Wrapper = styled(container)`
  width: 100%;
  height: auto;
  position: relative;
  color: ${({ theme }) => theme.primary};
  z-index: 1;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Row = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: space-between;

  & > div {
    flex: 1;
  }

  .left {
    width: 1vw;
    float: left;
    margin-right: 10px;
  }
  .right {
    width: 1vw;
    float: right;
    margin-left: 10px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    display: block;
    gap: unset;

    & > div {
      flex: unset;
      margin-bottom: unset;
    }

    .left {
      width: 100%;
      float: left;
      margin: unset;
    }

    .right {
      width: 100%;
      float: left;
      margin-left: 0px;
      margin-top: 20px;
    }
  }
`

const Footer = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & span {
    opacity: 0.7;
    font-family: OpenSans;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    flex-direction: column;
    justify-content: center;
  }
`

const Dashboard = () => {
  const navigate = useNavigate()
  const { api } = useDashboardAPI()
  const { data: pairs, isLoading: isPairsLoading } = useQuery(
    "pairs",
    api.pairs.list
  )

  const chart = Data.map((data) => data)
  const [selectedVolumeLength, setSelectedVolumeLength] = useState(3)
  const [selectedLiquidityLength, setSelectedLiquidityLength] = useState(7)

  const [autoRefreshTicker, setAutoRefreshTicker] = useState(false)

  let [currentSupply, setCurrentSupply] = useState(0)
  let [currentPrice, setCurrentPrice] = useState(0)
  let [currentReserve, setCurrentReserve] = useState(0)
  let [taxCollected, setTaxCollected] = useState(0)
  let [luna1Price, setLuna1Price] = useState(0)
  let [luna2Price, setLuna2Price] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      if (window?.navigator?.onLine && window?.document?.hasFocus()) {
        setAutoRefreshTicker((current) => !current)
      }
    }, 30000)
    return () => {
      clearInterval(timerId)
    }
  }, [autoRefreshTicker])

  useEffect(() => {
    const url =
      "https://terra-classic-lcd.publicnode.com/wasm/contracts/terra14tfl8s9ag200r5slncgyzqv9dyq3dl0zu73afg/store?query_msg=%7B%22curve_info%22:%7B%7D%7D"
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const tbcData = JSON.parse(text)
        setCurrentSupply(Number(tbcData.result.supply) / 1000000)
        setCurrentPrice(Number(tbcData.result.spot_price)/ 1000000)
        setCurrentReserve(Number(tbcData.result.reserve) / 1000000)
        setTaxCollected(Number(tbcData.result.tax_collected) / 1000000)
      })

      console.log(currentPrice);

    const url2 =
      "https://api.coingecko.com/api/v3/simple/price?ids=terra-luna-2&vs_currencies=usd"
    fetch(url2)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const apiCoinGeckoLuna = JSON.parse(text)
        setLuna2Price(Number(apiCoinGeckoLuna["terra-luna-2"]["usd"]))
      })

    const url3 =
      "https://api.coingecko.com/api/v3/simple/price?ids=terra-luna&vs_currencies=usd"
    fetch(url3)
      .then((response) => response.text())
      .then((text) => {
        console.log(text)
        const apiCoinGeckoLunc = JSON.parse(text)
        setLuna1Price(Number(apiCoinGeckoLunc["terra-luna"]["usd"]))
      })

    return
  }, [autoRefreshTicker])

  const selectedVolumeChart = useMemo(() => {
    if (luna1Price > 0) {
      const timeNow = new Date(new Date().getTime()).toISOString()
      chart.splice(0, 0, {
        timestamp: String(timeNow),
        volumeUst: (currentPrice * luna1Price * 1000000).toFixed(2).toString(),
        liquidityUst: "14259822",
      })
    }

    return (chart || []).slice(0, selectedVolumeLength * 24)
  }, [chart, selectedVolumeLength]) //chart,
  
  const topLiquidity = useMemo(() => {
    return undefined //do not use api
  }, [pairs])

  const topTrading = useMemo(() => {
    return undefined //do not use api
  }, [pairs])

  const restLiquidityUst = useMemo(() => {
    return undefined //do not use api
  }, [pairs])

  const restTradingUst = useMemo(() => {
    return undefined //do not use api
  }, [pairs])

  const dataForChild = [currentPrice * luna1Price, currentSupply]

  return (
    <Wrapper>
      <Container>
        <AboutWebsiteHeader />
      </Container>

      <Container>
        <Summary
          data={[
            {
              label: "LUNC / USD",
              value: luna1Price.toString(),
              isCurrency: true,
              decimals: 6,
            },
            {
              label: "BASE / USD",
              value: ((currentPrice * luna1Price)) .toString(),
              isCurrency: true,
              decimals: 9,
            },
            {
              label: "BASE / LUNC",
              value: ((currentPrice * luna1Price)/luna1Price) .toString(),
              isCurrency: false,
              decimals: 6,
            },
            /*{
              label: "Circulating Supply",
              value: `${currentSupply}`,
              isCurrency: false,
              decimals: 6,
            },
            {
              label: "LUNC Reserve",
              value: (currentReserve).toString(),
              isCurrency: false,
              decimals: 2,
            },
            {
              label: "Market Cap",
              value: (currentSupply * currentPrice * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
            }, */
          ]}
        />

        <Row>
          <Card className="left">
            <Row
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "unset", fontSize: 18, color: "#0d0d2b" }}>
                <b>BASE Price</b>
              </div>
              <div style={{ flex: "unset" }}>
                <Select
                  value={selectedVolumeLength}
                  onChange={(e) =>
                    setSelectedVolumeLength(parseInt(e?.target?.value, 10))
                  }
                >
                  {[14, 7, 3, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} days
                    </option>
                  ))}
                </Select>
              </div>
            </Row>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 14,
                color: "#0d0d2b",
              }}
            >
              ${(currentPrice * luna1Price).toFixed(9)}
              &nbsp;USD
            </div>
            <Chart
              type="line"
              height={178}
              data={selectedVolumeChart?.map((volume) => {
                return {
                  t: new Date(volume.timestamp),
                  y: Number(lookup(volume.volumeUst, UST)),
                }
              })}
            />
          </Card>
        </Row>
        <Summary
          data={[
            {
              label: "Dev Donations",
              value: (taxCollected * 0.25 * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
            },
            {
              label: "LUNC Burned",
              value: (
                (taxCollected * 0.25 * luna2Price) /
                luna1Price
              ).toString(),
              isCurrency: false,
              decimals: 4,
            },
            {
              label: "Raffle Winnings",
              value: (taxCollected * 0.25 * luna2Price).toString(),
              isCurrency: true,
              decimals: 2,
            },
            {
              label: "Tax Collected",
              value: `${taxCollected * luna2Price}`,
              isCurrency: true,
              decimals: 2,
            },
          ]}
        />

        <AboutWebsiteMain
          priceFromParent={dataForChild[0]}
          supplyFromParent={dataForChild[1]}
        />

        <Footer>
          <span>DASHBOARD IS FOR REFERENCE PURPOSES ONLY</span>

          <a
            className="main-header-navbar__nav__link"
            href="mailto: lbunproject@gmail.com"
          >
            Contact info: lbunproject@gmail.com
          </a>
        </Footer>
      </Container>
    </Wrapper>
  )
}

export default Dashboard
