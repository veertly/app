import React from "react";

import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, LinkedinIcon, RedditIcon, TelegramIcon, TwitterIcon, WhatsappIcon } from "react-share";

function EventShareIcons(props) {
  const { url, shareText } = props;

  return (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <TwitterShareButton title={shareText} url={url}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton quote={shareText} url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <LinkedinShareButton title={shareText} url={url}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <RedditShareButton title={shareText} url={url}>
          <RedditIcon size={32} round />
        </RedditShareButton>

        <TelegramShareButton title={shareText} url={url}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <WhatsappShareButton title={shareText} url={url}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </React.Fragment>
  );
}

export default EventShareIcons;
