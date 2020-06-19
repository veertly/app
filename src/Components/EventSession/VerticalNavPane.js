import React, { useState, Suspense, useMemo } from "react";
import { makeStyles /*, useTheme */ } from "@material-ui/core/styles";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";

import { Box, Typography, IconButton, Tooltip } from "@material-ui/core";
import VerticalNavBarContext, {
  VERTICAL_NAV_OPTIONS
} from "../../Contexts/VerticalNavBarContext";
import ConversationsPane from "./LocationPanes/NetworkingPane";
import RoomsTab from "./Rooms/RoomsTab";
import ChatPane from "../Chat/ChatPane";
import MainStagePane from "./LocationPanes/MainStagePane";
import LobbyPane from "./LocationPanes/LobbyPane";
import PollsPane from "./Polls/PollsPane";
import QnAPane from "./LocationPanes/QnAPane";
import HelpPane from "./LocationPanes/HelpPane";
import SplashScreen from "../Misc/SplashScreen";

// import InfoIcon from "../../Assets/Icons/Info";
import AttendeesPane, {
  ATTENDEES_PANE_FILTER
} from "./LocationPanes/AttendeesPane";
import { useSelector, shallowEqual } from "react-redux";
import { getFeatureDetails } from "../../Redux/eventSession";
import { FEATURES } from "../../Modules/features";
import _ from "lodash";
import { DEAFULT_NAV_BAR } from "./VerticalNavBar";
import { PollsContextWrapper } from "../../Contexts/PollsContext";

export const getSectionTitle = (currentNavBarSelection, navBarItem) => {
  switch (currentNavBarSelection) {
    case VERTICAL_NAV_OPTIONS.lobby:
      return navBarItem ? navBarItem.label : "Lobby";

    case VERTICAL_NAV_OPTIONS.mainStage:
      return `${navBarItem ? navBarItem.label : "Main Stage"} Attendees`;

    case VERTICAL_NAV_OPTIONS.rooms:
      return navBarItem ? navBarItem.label : "Rooms";

    case VERTICAL_NAV_OPTIONS.networking:
      return navBarItem ? navBarItem.label : "Networking";

    case VERTICAL_NAV_OPTIONS.attendees:
      return `All ${navBarItem ? navBarItem.label : "Attendees"}`;

    case VERTICAL_NAV_OPTIONS.chat:
      return `Global ${navBarItem ? navBarItem.label : "Chat"}`;

    case VERTICAL_NAV_OPTIONS.polls:
      return navBarItem ? navBarItem.label : "Polls";

    case VERTICAL_NAV_OPTIONS.qna:
      return navBarItem ? navBarItem.label : "Q&A";

    case VERTICAL_NAV_OPTIONS.help:
      return "Help";

    default:
      return "";
  }
};

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
    display: "flex",
    alignItems: "center"
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
  },
  infoIcon: {
    color: theme.palette.primary.light,
    fontSize: "1em",
    marginLeft: theme.spacing(2)
  },
  counter: {
    color: theme.palette.text.hint
  }
}));

const VerticalNavPane = (props) => {
  // const { eventSession, user } = props;
  const classes = useStyles();
  const [titleCount, setTitleCount] = useState(null);

  const {
    currentNavBarSelection,
    setHasNavBarPaneOpen,
    setCurrentNavBarSelection
  } = React.useContext(VerticalNavBarContext);

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );
  const navBarOptions = useMemo(() => {
    if (!customNavBarFeature) {
      return Object.values(DEAFULT_NAV_BAR);
    }

    let result = { ...DEAFULT_NAV_BAR };

    _.forEach(Object.values(customNavBarFeature), ({ id, label, visible }) => {
      if (result[id]) {
        result[id].label = label;
        result[id].visible = visible !== false;
      }
    });

    return result;
  }, [customNavBarFeature]);

  const getTitle = () => {
    let navBarItem = navBarOptions[currentNavBarSelection];
    return getSectionTitle(currentNavBarSelection, navBarItem);
  };

  const collapsePane = () => {
    setCurrentNavBarSelection(null);
    setHasNavBarPaneOpen(false);
  };

  const showCount =
    currentNavBarSelection === VERTICAL_NAV_OPTIONS.mainStage ||
    currentNavBarSelection === VERTICAL_NAV_OPTIONS.attendees ||
    currentNavBarSelection === VERTICAL_NAV_OPTIONS.rooms;

  return (
    <Suspense fallback={<SplashScreen />}>
      <div className={classes.root}>
        <Box className={classes.titleBox}>
          <Typography color="secondary" className={classes.paneTitle}>
            {getTitle()}
            {showCount && titleCount > 0 && (
              <span className={classes.counter}>{` (${titleCount})`}</span>
            )}
          </Typography>
          {/* <InfoIcon className={classes.infoIcon} /> */}

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
          <Suspense fallback={<SplashScreen />}>
            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.mainStage && (
              <MainStagePane setTotalUsers={setTitleCount} />
            )}
            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.lobby && (
              <LobbyPane />
            )}
            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.rooms && (
              <RoomsTab setRoomsCount={setTitleCount} />
            )}

            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.networking && (
              <ConversationsPane />
            )}

            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.attendees && (
              <AttendeesPane
                paneFilter={ATTENDEES_PANE_FILTER.all}
                showFilter={true}
                setTotalUsers={setTitleCount}
              />
            )}

            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.chat && (
              <ChatPane />
            )}
            <PollsContextWrapper>
              {currentNavBarSelection === VERTICAL_NAV_OPTIONS.polls && (
                <PollsPane />
              )}
            </PollsContextWrapper>

            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.qna && <QnAPane />}

            {currentNavBarSelection === VERTICAL_NAV_OPTIONS.help && (
              <HelpPane />
            )}
          </Suspense>
        </Box>
      </div>
    </Suspense>
  );
};

export default VerticalNavPane;
