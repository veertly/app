import React from "react";
import { Helmet } from "react-helmet";

const AppMetaTags = () => {
  return (
    <Helmet> 
      <title>Veertly | Virtual events, virtual networking!</title>
      <meta name="title" content="Veertly | Virtual events, virtual networking!" />
      <meta name="description" content="" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://app.veertly.com/" />
      <meta property="og:title" content="Veertly | Virtual events, virtual networking!" />
      <meta property="og:description" content="" />
      <meta property="og:image" content="/DefaultEventBanner.svg" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://app.veertly.com/" />
      <meta property="twitter:title" content="Veertly | Virtual events, virtual networking!" />
      <meta property="twitter:description" content="" />
      <meta property="twitter:image" content="/DefaultEventBanner.svg" />
    </Helmet>
  )
}

export default AppMetaTags;
