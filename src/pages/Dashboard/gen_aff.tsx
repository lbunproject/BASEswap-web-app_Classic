import { useState, useMemo, ReactElement, useEffect } from "react"
import styled from "styled-components"

import container from "components/Container"

import { useNetwork, useContract, useAddress, useConnectModal } from "hooks"

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

const Affiliate = () => {
  const walletAddress = useAddress()

  let thisIsMyCopy = `https://basetokenswap.netlify.app/swap?type=swap&from=uluna&to=terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m&aff=${walletAddress}`

  return (
    <Wrapper>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "px",
            fontSize: "28px",
          }}
        >
          <h1
            style={{ textAlign: "center", fontSize: "48px", color: "#F0F0F0" }}
          >
            $BASE Token Affiliate Program
          </h1>
          <h2 style={{ color: "#CD6141" }}>Get 5% commission</h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "#F0F0F0",
            }}
          >
            Your <span>personal affiliate</span> URL is:
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{ paddingLeft: "15px", fontSize: "12px", color: "#F0F0F0" }}
          >
            {(() => {
              if (walletAddress) {
                return (
                  <div>
                    <h1
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "#F0F0F0",
                      }}
                    >
                      <a
                        className="main-header-navbar__nav__link"
                        href={thisIsMyCopy}
                      >
                        {" "}
                        My Affiliate Link
                      </a>
                    </h1>
                    <p> Right-Click and select "Copy Link Address"</p>
                  </div>
                )
              } else {
                return <p>Connect wallet to generate URL</p>
              }
            })()}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "#F0F0F0",
            }}
          >
            <a
              className="main-header-navbar__nav__link"
              href="https://tinyurl.com/app"
            >
              {" "}
              Recommend using TinyURL.com to shorten
            </a>
          </h1>
        </div>
      </Container>
    </Wrapper>
  )
}

export default Affiliate
