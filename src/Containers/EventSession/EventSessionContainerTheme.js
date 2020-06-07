import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getFeatureDetails } from "../../Redux/eventSession";
import { FEATURES } from "../../Modules/features";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

function EventSessionContainerTheme({ children }) {
  const customThemeFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_THEME)
  );

  const theme = useMemo(() => {
    if (customThemeFeature) {
      const { primary, secondary } = customThemeFeature;
      return createMuiTheme({
        palette: {
          primary: { main: primary },
          secondary: { main: secondary }
        }
      });
    }
    return {};
  }, [customThemeFeature]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

EventSessionContainerTheme.propTypes = {
  children: PropTypes.node.isRequired
};

export default EventSessionContainerTheme;
