import React from "react"
import { TooltipIcon } from "components/Tooltip"
import Tooltip from "lang/Tooltip.json"

const AboutWebsiteMain = ({ priceFromParent, supplyFromParent }) => {
  return (
    <div>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Landing page for BASE" />
      <meta name="author" content="BASE Developers" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
        crossOrigin="anonymous"
      />
      {/* Styles */}
      <link rel="stylesheet" href="../index.scss" />
      <title>LUNC Burn Token</title>

      <main className="main-content">
        <div className="main-header-content-container">
          <div className="main-header-content-principal">
            <h1 className="main-header-content-principal__title">
              Accelerated <span>LUNC Burning </span> via Community based
              <span> Token Bonding Curve.</span>
            </h1>
            <p className="main-header-content-principal__description">
              <br></br>
              Burning LUNC for fun and profit...
              <br></br>
              and donating 75% of TX fees
              <br></br>
              to Devs, Burns and Raffles!
            </p>
          </div>
          <img
            src="/images/header-assets/header-Illustration.svg"
            alt=""
            className="main-header-content-principal__illustration"
          />
        </div>

        <section className="why-us-wrapper">
          <div className="stats-section">
            <div className="stats-section__reference">
              <i className="fas fa-fire"></i>
              <h3 className="stats-section__reference__title">
                Goal 50 Billion
              </h3>
              <p className="stats-section__reference__description">
                LUNC Burned
              </p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-wallet"></i>
              <h3 className="stats-section__reference__title">24</h3>
              <p className="stats-section__reference__description">
                Community Wallets
              </p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-ticket-alt"></i>
              <h3 className="stats-section__reference__title">$10M Possible</h3>
              <p className="stats-section__reference__description">
                Raffle Winnings
              </p>
            </div>
          </div>

          <div className="stats-section">
            <div className="stats-section__reference">
              <i className="fas fa-dollar-sign"></i>
              <h3 className="stats-section__reference__title">
                ${priceFromParent.toFixed(4)} USD
              </h3>
              <p className="stats-section__reference__description">
               BASE Price
              </p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-coins"></i>
              <h3 className="stats-section__reference__title">
                {supplyFromParent.toFixed(4)}
              </h3>
              <p className="stats-section__reference__description">
               BASE Supply
              </p>
            </div>
          </div>

          <div className="why-us-section" id="about">
            <div className="why-us-section__content">
              <h2 className="why-us-section__content__title">
                Why should you choose
                <span> BASE </span>
                for your LUNC burning contributions?
              </h2>
              <p className="why-us-section__content__description">
                The BASE project seeks to return the power to the LUNC
                community. No more begging Centralized Exchanges to implement or
                sustain the burn tax.
              </p>
            </div>
            <img
              src="\images\Token\LBUNC-min.svg"
              alt=""
              className="why-us-section__illustration"
            />
          </div>

          <div className="benefits-section">
            <h2 className="benefits-section__title">
              Participate in weekly <span>Raffles </span> to win rewards based
              on buy & sell <span>transactions </span> durning that week!
              <TooltipIcon content={Tooltip.Dashboard.Raffle}> *</TooltipIcon>
            </h2>
            <p className="benefits-section__description">
              Must hold BASE in wallet (any amount), but odds of winning
              increase when more BASE is held.
              <TooltipIcon content={Tooltip.Dashboard.Odds}> *</TooltipIcon>
            </p>
          </div>
        </section>

        <section className="cryptocurrencies-section" id="components">
          <h2 className="cryptocurrencies-section__title">
            Efficient Fund Raising by Integrating Optimal Technologies,
            Protocols and Algorithms.
          </h2>
          <div className="cryptocurrencies-info-cards">
            <div className="info-card">
              <img
                src="/images/features-section-assets/stacked_small.png"
                alt=""
                className="info-card__icon"
              />
              <h3 className="info-card__title">
                Terra Classic / Terra 2<br></br>and Solana
              </h3>
              <p className="info-card__description">
                Low fees, Fast Transactions
              </p>
              <a
                href="https://finder.terra.money/classic/address/terra14tfl8s9ag200r5slncgyzqv9dyq3dl0zu73afg"
                className="info-card__btn"
              >
                Explore <i className="fas fa-angle-right"></i>
              </a>
            </div>
            <div className="info-card">
              <img
                src="/images/features-section-assets/cosmwasm_small.png"
                alt=""
                className="info-card__icon"
              />
              <h3 className="info-card__title">
                CosmWasm
                <br></br>Ecosystem
              </h3>
              <p className="info-card__description">
                WebAssembly Smart Contracts
              </p>
              <a href="https://cosmwasm.com/" className="info-card__btn">
                Learn <i className="fas fa-angle-right"></i>
              </a>
            </div>
            <div className="info-card">
              <img
                src="/images/others/tbc.svg"
                alt=""
                className="info-card__icon"
              />
              <h3 className="info-card__title">
                Token Bonding
                <br></br>Curve AMM
              </h3>
              <p className="info-card__description">
                Instant Liquidity, Quick Swaps
              </p>
              <a href="/swap" className="info-card__btn">
                Swap <i className="fas fa-angle-right"></i>
              </a>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <h2 className="features-section__title">
            LUNC Burn Token Project Features:
          </h2>

          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                LUNC Burning
              </h3>
              <p className="grow-profit-article__content__description">
                1. Each transaction provides for a 1.2% burn
                <br></br>
                <br></br>
                2. Potential for $8M for burning LUNC @ 100K BASE supply
                <br></br>
                <br></br>
                3. Burn conducted weekly with verification
                <br></br>
                <br></br>
                4. Community activity determines burn amount
              </p>
            </div>
          </article>

          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                Raffle Prizes
              </h3>
              <p className="grow-profit-article__content__description">
                1. Potential for $10M in prizes @ 100K BASE supply
                <br></br>
                <br></br>
                2. Drawing conducted weekly (after LUNC burn)
                <br></br>
                <br></br>
                3. Odds of winning set by amount of BASE in wallet
                <br></br>
                <br></br>
                4. Prize size determined by community activity
              </p>
            </div>
          </article>

          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                Token Bonding Curve
              </h3>
              <p className="grow-profit-article__content__description">
                1. Instant Liquidity
                <br></br>
                <br></br>
                2. Decentralized fund raising
                <br></br>
                <br></br>
                3. BASE value determined solely by community
                <br></br>
                <br></br>
                4. Uncapped market (limitless supply)
              </p>
            </div>
          </article>

          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                CosmWasm
              </h3>
              <p className="grow-profit-article__content__description">
                1. Tight integration with Cosmos SDK & the Cosmos ecosystem
                <br></br>
                <br></br>
                2. Secure architecture design to mitigate attack vectors
                <br></br>
                <br></br>
                3. Mature tooling for developing and testing smart contracts
                <br></br>
                <br></br>
                4. Smart contracts run on multiple chains using the IBC protocol
              </p>
            </div>
          </article>

          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                Terra Classic Blockchain
              </h3>
              <p className="grow-profit-article__content__description">
                1. Uses well-known languages (GoLang, Rust, Wasm)
                <br></br>
                <br></br>
                2. Extremely low transaction fees / Fast block times
                <br></br>
                <br></br>
                3. Built on Tendermint Core (BFT consensus engine)
                <br></br>
                <br></br>
                4. Resilient and Resourceful Community
              </p>
            </div>
          </article>
        </section>

        <section className="team-section" id="team">
          <h2 className="team-section__title">
            Small Team creating big impact!
          </h2>
          <div className="team-info-cards">
            <div className="info-card">
              <img
                src="/images/team/Renzo.png"
                alt=""
                className="info-card__icon"
              />
              <h3 className="info-card__title">Renzo</h3>
              <p className="info-card__description">
                Lead Developer & Project Manager
              </p>
            </div>
            <div className="info-card">
              <img
                src="/images/team/Eric.png"
                alt=""
                className="info-card__icon"
              />
              <h3 className="info-card__title">Eric</h3>
              <p className="info-card__description">
                Junior Developer & Social Media Manager
              </p>
            </div>
            <div className="info-card">
              <img
                src="/images/team/David.png"
                alt=""
                className="info-card__icon"
              />
              <h3 className="info-card__title">David</h3>
              <p className="info-card__description">
                LUNC Validator & Asst Project Manager
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AboutWebsiteMain
