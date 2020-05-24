import React from "react";
import _ from "lodash";
import countries from "../../Config/countries";
import ReactCountryFlag from "react-country-flag";
import { isWindows } from "../../Utils/device";

const emojiSupport = require("../../Helpers/detectEmojiSupport");

const emojiSupported = emojiSupport();

export default ({ locationDetails }) => {
  if (locationDetails && emojiSupported && !isWindows()) {
    let { terms } = locationDetails;
    let countryName = _.last(terms);
    if (countryName) {
      let country = _.find(
        countries,
        (c) => c.name.toLowerCase() === countryName.value.toLowerCase()
      );
      if (country) {
        return (
          <ReactCountryFlag
            countryCode={country.countryCode}
            // svg
            style={{
              fontSize: "1em",
              lineHeight: "1em"
            }}
          />
        );
      }
    }
  }
  return null;
};
