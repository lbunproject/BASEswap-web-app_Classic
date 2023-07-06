//import React from 'react';

const AboutWebsiteHeader = () => {
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
      <link rel="stylesheet" href="../index.scss" />
      <title>LUNC Burn Token</title>
      <header className="main-header">
        <div className="header-container">
          <nav className="main-header-navbar"></nav>
          <nav className="main-header-navbar">
            <ul className="main-header-navbar__nav">
              <li className="main-header-navbar__nav__item">
                <a href="https://basetokenswap.netlify.app/">BASE Token dApp</a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#components" className="main-header-navbar__nav__link">
                  Elements
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#features" className="main-header-navbar__nav__link">
                  Features
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#team" className="main-header-navbar__nav__link">
                  Team
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a
                  href="https://finder.terra.money/classic/address/terra1uewxz67jhhhs2tj97pfm2egtk7zqxuhenm4y4m"
                  className="main-header-navbar__nav__link"
                >
                  Explorer
                </a>
              </li>
            </ul>
            <div className="main-header-navbar__login"></div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default AboutWebsiteHeader
