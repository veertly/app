import React from "react";
import { makeStyles /*, useTheme */ } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import ChatIcon from "@material-ui/icons/Chat";
import Tooltip from "@material-ui/core/Tooltip";
import ProfileIcon from "@material-ui/icons/AccountBox";
import FAQIcon from "@material-ui/icons/LiveHelp";
import SettingsIcon from "@material-ui/icons/Settings";
import AboutIcon from "@material-ui/icons/Info";
import EventDescriptionIcon from "@material-ui/icons/Notes";
import ShareIcon from "@material-ui/icons/Share";

import { useDispatch, useSelector } from "react-redux";
import { openEditProfile, openEventDetails, openChat, closeChat, openShare } from "../../Redux/actions";
import routes from "../../Config/routes";
import { isChatOpen } from "../../Redux/selectors";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { logout } from "../../Modules/userOperations";
import { useHistory } from "react-router-dom";
// import { Badge } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
}));

export default function SideMenuIcons(props) {
  const { eventSession, user } = props;
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();
  const chatOpen = useSelector(isChatOpen);

  const isOwner = React.useMemo(() => eventSession && user && eventSession.owner === user.uid, [eventSession, user]);

  const openProfile = React.useCallback(() => dispatch(openEditProfile()), [dispatch]);
  const openDetails = React.useCallback(() => dispatch(openEventDetails()), [dispatch]);
  const openShareEvent = React.useCallback(() => dispatch(openShare()), [dispatch]);
  const history = useHistory();

  const toggleChatPane = React.useCallback(() => {
    if (chatOpen) {
      dispatch(closeChat());
    } else {
      dispatch(openChat());
    }
  }, [dispatch, chatOpen]);

  return (
    <div className={classes.root}>
      <List>
        <Tooltip title="Edit Profile">
          <ListItem button onClick={openProfile}>
            <ListItemIcon>
              <ProfileIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        {/* <Tooltip title="My stats">
          <ListItem button disabled>
            <ListItemIcon>
              <StatsIcon />
            </ListItemIcon>
          </ListItem>
        </Tooltip> */}
      </List>
      {isOwner && (
        <>
          <Divider />
          <List>
            <Tooltip
              title="Edit event"
              onClick={() => {
                window.open(window.open(routes.EDIT_EVENT_SESSION(eventSession.id), "_blank"));
              }}
            >
              <ListItem button>
                <ListItemIcon>
                  <SettingsIcon color="primary" />
                </ListItemIcon>
              </ListItem>
            </Tooltip>
          </List>
        </>
      )}
      <Divider />
      <List>
        <Tooltip title="Chat" onClick={toggleChatPane}>
          <ListItem button>
            <ListItemIcon>
              {/* <Badge color="secondary" variant="dot"> */}
              <ChatIcon color="primary" />
              {/* </Badge> */}
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        {/* <Tooltip title="Questions and Answers">
          <ListItem button disabled>
            <ListItemIcon>
              <QnAIcon />
            </ListItemIcon>
          </ListItem>
        </Tooltip> */}
        <Tooltip title="Event details">
          <ListItem button onClick={openDetails}>
            <ListItemIcon>
              <EventDescriptionIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        <Tooltip title="Share event">
          <ListItem button onClick={openShareEvent}>
            <ListItemIcon>
              <ShareIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
      </List>
      <Divider />
      <List>
        <Tooltip title="FAQ">
          <ListItem
            button
            onClick={() => {
              window.open("https://veertly.com/faqs", "_blank");
            }}
          >
            <ListItemIcon>
              <FAQIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        <Tooltip title="About Veertly">
          <ListItem
            button
            onClick={() => {
              window.open("https://veertly.com", "_blank");
            }}
          >
            <ListItemIcon>
              <AboutIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
        {/* <Tooltip title="Provide Feedback">
          <ListItem button disabled>
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
          </ListItem>
        </Tooltip> */}
      </List>
      <Divider />
      <div style={{ flexGrow: 1 }}></div>
      <List>
        <Tooltip title="Exit Event">
          <ListItem
            button
            onClick={() => {
              logout();
              history.push(routes.EVENT_SESSION(eventSession.id));
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
      </List>
    </div>
  );
}
