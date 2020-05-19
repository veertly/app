import React from "react";
import clsx from "clsx";
import { makeStyles /* useTheme */ } from "@material-ui/styles";
// import { useMediaQuery } from "@material-ui/core";
import Container from "@material-ui/core/Container";

import CenteredTopbar from "./CenteredTopbar";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    },
    position: "relative"
  },
  shiftContent: {
    paddingLeft: 300
  },
  content: {
    height: "100%",
    backgroundColor: theme.palette.background.default
    // position: "absolute",
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0
  }
}));
const CenteredLayout = (props) => {
  const { children, maxWidth } = props;

  let width = maxWidth ? maxWidth : "lg";
  const classes = useStyles();
  // const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"), {
  //   defaultMatches: true
  // });

  return (
    <div
      className={clsx({
        [classes.root]: true
      })}
    >
      <CenteredTopbar />
      <Container maxWidth={width}>
        <main className={classes.content}>{children}</main>
      </Container>
    </div>
  );
};

// CenteredLayout.whyDidYouRender = true;

export default CenteredLayout;
