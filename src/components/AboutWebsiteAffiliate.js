import React from "react"
import { TooltipIcon } from "components/Tooltip"
import Tooltip from "lang/Tooltip.json"

const AboutWebsiteAffiliate = () => {
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
              Your <span>personal affiliate</span> URL is:
            </h1>
          </div>
          <br></br>
          <br></br>
          <div className="main-header-content-principal">
            <p className="main-header-content-principal__description">
              Burning LUNC for fun and profit...
              <br></br>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AboutWebsiteAffiliate
