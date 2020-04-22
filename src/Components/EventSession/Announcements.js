import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import { getEventSessionDetails } from "../../Redux/eventSession";

export const ANNOUNCEMENT_HEIGHT = 37;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ANNOUNCEMENT_HEIGHT,
    // opacity: 0.6,
    backgroundColor: theme.palette.background.default,
    zIndex: 1,
    // paddingTop: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    // transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    // "-webkit-box-shadow": "0px 2px 3px 0px rgba(238,238,238,0.65)",
    // "-moz-box-shadow": "0px 2px 3px 0px rgba(238,238,238,0.65)",
    "box-shadow": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
}));

export default () => {
  const classes = useStyles();
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  if (
    eventSessionDetails.announcements &&
    eventSessionDetails.announcements.conference &&
    eventSessionDetails.announcements.conference.trim() !== ""
  ) {
    return (
      <div id="conference-container" className={classes.root}>
        <Typography align="center" variant="caption" display="block">
          {eventSessionDetails.announcements.conference}
        </Typography>
      </div>
    );
  }
  return null;
};
