import React from "react";
import { makeStyles /*, useTheme */ } from "@material-ui/core/styles";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";

import { Box, Typography, IconButton, Tooltip } from "@material-ui/core";
import VerticalNavBarContext, {
  VERTICAL_NAV_OPTIONS
} from "../../Contexts/VerticalNavBarContext";
import ConversationsTab from "./ConversationsTab";
import RoomsTab from "./RoomsTab";
import ChatPane from "../Chat/ChatPane";
import MainStagePane from "./LocationPanes/MainStagePane";
import LobbyPane from "./LocationPanes/LobbyPane";
import PollsPane from "./LocationPanes/PollsPane";
import QnAPane from "./LocationPanes/QnAPane";
import AttendeesPane, {
  ATTENDEES_PANE_FILTER
} from "./LocationPanes/AttendeesPane";

// import { Badge } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
    // paddingTop: theme.spacing(2)
  },
  titleBox: {
    padding: theme.spacing(1.5, 1, 1.5, 2),
    display: "flex"
  },
  rotateIcon: {
    "-ms-transform": "rotate(180deg)",
    transform: "rotate(180deg)"
  },
  paneTitle: {
    textTransform: "uppercase"
  },
  collapseButton: {
    color: theme.palette.primary.light
  },
  paneContent: {
    overflow: "auto"
  }
}));

const VerticalNavPane = (props) => {
  // const { eventSession, user } = props;
  const classes = useStyles();

  const {
    currentNavBarSelection,
    setHasNavBarPaneOpen,
    setCurrentNavBarSelection
  } = React.useContext(VerticalNavBarContext);

  const getTitle = () => {
    console.log({ currentNavBarSelection });
    switch (currentNavBarSelection) {
      case VERTICAL_NAV_OPTIONS.lobby:
        return "Lobby";

      case VERTICAL_NAV_OPTIONS.mainStage:
        return "Main Stage Attendees";

      case VERTICAL_NAV_OPTIONS.rooms:
        return "Rooms";

      case VERTICAL_NAV_OPTIONS.networking:
        return "Networking";

      case VERTICAL_NAV_OPTIONS.attendees:
        return "All Attendees";

      case VERTICAL_NAV_OPTIONS.chat:
        return "Chat";

      case VERTICAL_NAV_OPTIONS.polls:
        return "Polls";

      case VERTICAL_NAV_OPTIONS.qna:
        return "Q&A";

      default:
        return "";
    }
  };

  const collapsePane = () => {
    setCurrentNavBarSelection(null);
    setHasNavBarPaneOpen(false);
  };

  return (
    <div className={classes.root}>
      <Box className={classes.titleBox}>
        <Typography color="secondary" className={classes.paneTitle}>
          {getTitle()}
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Tooltip title="Collapse">
          <IconButton
            className={classes.collapseButton}
            size="small"
            onClick={collapsePane}
          >
            <DoubleArrowIcon
              fontSize="inherit"
              className={classes.rotateIcon}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Box className={classes.paneContent}>
        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.mainStage && (
          <MainStagePane />
        )}
        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.lobby && <LobbyPane />}
        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.rooms && <RoomsTab />}

        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.networking && (
          <ConversationsTab />
        )}

        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.attendees && (
          <AttendeesPane
            paneFilter={ATTENDEES_PANE_FILTER.all}
            showFilter={true}
          />
        )}

        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.chat && <ChatPane />}

        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.polls && <PollsPane />}

        {currentNavBarSelection === VERTICAL_NAV_OPTIONS.qna && <QnAPane />}
      </Box>
      {/* <MenuIconContainer icon={ChatIcon} label="Chat" /> */}

      {/* <List>
        <Tooltip title="Exit Event">
          <ListItem
            button
            onClick={() => {
              logout();
              history.push(routes.EVENT_SESSION(sessionId));
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon color="primary" />
            </ListItemIcon>
          </ListItem>
        </Tooltip>
      </List> */}
    </div>
  );
};

export default VerticalNavPane;
