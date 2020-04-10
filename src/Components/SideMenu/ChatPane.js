import React, { useCallback } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import ChatIcon from "@material-ui/icons/Chat";
import QnAIcon from "@material-ui/icons/Forum";
import Tooltip from "@material-ui/core/Tooltip";
import ProfileIcon from "@material-ui/icons/AccountBox";
import FAQIcon from "@material-ui/icons/LiveHelp";
import StatsIcon from "@material-ui/icons/Assessment";
import SettingsIcon from "@material-ui/icons/Settings";
import AboutIcon from "@material-ui/icons/Info";
import EventDescriptionIcon from "@material-ui/icons/Notes";
import FeedbackIcon from "@material-ui/icons/Feedback";

import { openEditProfile, openEventDetails, closeChat } from "../../Redux/actions";
import routes from "../../Config/routes";
import { isChatOpen, isEventDetailsOpen } from "../../Redux/selectors";
import { useDispatch, useSelector } from "react-redux";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "absolute",
    // top: 64,
    // right: 0,
    // bottom: 0,
    // backgroundColor: "red",
    // width: 250,
    // transition: theme.transitions.create(["width", "margin"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
    // display: "flex",
  },
  // appBar: {
  //   zIndex: theme.zIndex.drawer + 1,
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  // },
  // appBarShift: {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // },
  // menuButton: {
  //   marginRight: 36,
  // },
  // hide: {
  //   display: "none",
  // },
  // drawer: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  //   whiteSpace: "nowrap",
  // },
  // drawerOpen: {
  //   width: drawerWidth,
  //   transition: theme.transitions.create("width", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // },
  // drawerClose: {
  //   transition: theme.transitions.create("width", {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  //   overflowX: "hidden",
  //   width: theme.spacing(7) + 1,
  //   [theme.breakpoints.up("sm")]: {
  //     width: theme.spacing(9) + 1,
  //   },
  // },
  // toolbar: {
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "flex-end",
  //   padding: theme.spacing(0, 1),
  //   // necessary for content to be below app bar
  //   ...theme.mixins.toolbar,
  // },
  // content: {
  //   flexGrow: 1,
  //   padding: theme.spacing(3),
  // },
  chatPane: {
    position: "absolute",
    top: 64,
    right: 53,
    bottom: 0,
    backgroundColor: "rgba(27, 71, 98, 0.4)",
    minWidth: 100,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    padding: theme.spacing(1),
    // borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
  },
  dragger: {
    width: "3px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: "100",
    backgroundColor: "#f4f7f9",
  },
  hide: {
    display: "none",
  },
}));

export default function ChatPane(props) {
  const { eventSession, user } = props;
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  // const isOwner = React.useMemo(() => eventSession && user && eventSession.owner === user.uid, [eventSession, user]);
  const chatOpen = useSelector(isChatOpen);

  const handleCloseChat = React.useCallback(() => dispatch(closeChat()), [dispatch]);
  // const openDetails = React.useCallback(() => dispatch(openEventDetails()), [dispatch]);

  return (
    <div
      className={clsx(classes.chatPane, {
        [classes.hide]: !chatOpen,
      })}
    >
      {/* https://stackblitz.com/edit/react-2h1g6x?file=ResponsiveDrawer.js */}
      <div
        id="dragger"
        onMouseDown={(event) => {
          this.handleMousedown(event);
        }}
        className={classes.dragger}
      />
      {`chat open: ${chatOpen ? "true" : "false"}`}
      <div className={classes.root}>ola</div>;
    </div>
  );
}

.green-button:{
  background-color:"green"
}
