import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Drawer } from "@material-ui/core";
import EventSessionTabs from "../../Components/EventSession/EventSessionTabs";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 300,
    // [theme.breakpoints.up("md")]: {
    //   marginTop: 64,
    //   height: "calc(100% - 64px)"
    // }
    marginTop: 64,
    height: "calc(100% - 64px)",
  },
  root: {
    backgroundColor: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  nav: {
    marginBottom: theme.spacing(2),
  },
}));

export default (props) => {
  const { open, variant, onClose, setIsInConferenceRoom } = props;

  const classes = useStyles();

  return (
    <React.Fragment>
      <Drawer anchor="left" classes={{ paper: classes.drawer }} onClose={onClose} open={open} variant={variant}>
        <EventSessionTabs setIsInConferenceRoom={setIsInConferenceRoom} />
      </Drawer>
    </React.Fragment>
  );
};
