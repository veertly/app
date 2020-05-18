import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  logo: {
    maxHeight: 40
  }
}));

function Logo(props) {
  const classes = useStyles();

  return (
    <img
      alt="Logo"
      src="/static/icon.svg"
      {...props}
      className={classes.logo}
    />
  );
}

export default Logo;
