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

import { useDispatch, useSelector } from "react-redux";
import { openEditProfile, openEventDetails, openChat, closeChat } from "../../Redux/actions";
import routes from "../../Config/routes";
import { isChatOpen } from "../../Redux/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
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
              <ProfileIcon />
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
                  <SettingsIcon />
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
              <ChatIcon />
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
              <EventDescriptionIcon />
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
              <FAQIcon />
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
              <AboutIcon />
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
      {/* <div style={{ flexGrow: 1 }}></div>
      <div>ola</div> */}
    </div>
  );
}
