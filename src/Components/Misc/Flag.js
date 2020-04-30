import React from "react";
import _ from "lodash";
import countries from "../../Config/countries";
import ReactCountryFlag from "react-country-flag";

export default ({ locationDetails }) => {
  if (locationDetails) {
    let { terms } = locationDetails;
    let countryName = _.last(terms);
    if (countryName) {
      let country = _.find(countries, (c) => c.name.toLowerCase() === countryName.value.toLowerCase());
      if (country) {
        return <ReactCountryFlag countryCode={country.countryCode} />;
      }
    }
  }
  return null;
};
