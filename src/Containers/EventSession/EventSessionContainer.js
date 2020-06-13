import React, { useEffect, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useSelector, shallowEqual } from "react-redux";
import NetworkingRoomContainer from "./NetworkingRoomContainer";
import PoweredByVeertly from "../../Assets/powered_by_veertly.svg";

import EventSessionTopbar from "../../Components/EventSession/EventSessionTopbar";
import ConferenceRoomContainer from "./ConferenceRoomContainer";
import Page from "../../Components/Core/Page";
import routes from "../../Config/routes";
import {
  DEFAULT_EVENT_OPEN_MINUTES,
  DEFAULT_EVENT_CLOSES_MINUTES
} from "../../Config/constants";
import EditProfileDialog from "../../Components/EditProfile/EditProfileDialog";
import FeedbackDialog from "../../Components/EventSession/FeedbackDialog";
import RoomArchivedDialog from "../../Components/EventSession/Rooms/RoomArchivedDialog";
import {
  getEventSessionDetails,
  getUserGroup,
  getUserCurrentLocation
} from "../../Redux/eventSession";
import JoinParticipantDialog from "../../Components/EventSession/JoinParticipantDialog";
import JitsiContext from "./JitsiContext";
import SmallPlayerContainer from "./SmallPlayerContainer";
import {
  SMALL_PLAYER_INITIAL_HEIGHT,
  SMALL_PLAYER_INITIAL_WIDTH
} from "../../Utils";
import JoinRoomDialog from "../../Components/EventSession/JoinRoomDialog";
import CreateRoomDialog from "../../Components/EventSession/CreateRoomDialog";
import VerticalNavBar from "../../Components/EventSession/VerticalNavBar";
import VerticalNavBarContext from "../../Contexts/VerticalNavBarContext";
import { VERTICAL_NAV_OPTIONS } from "../../Contexts/VerticalNavBarContext";
import VerticalNavPane from "../../Components/EventSession/VerticalNavPane";
import EventPage from "../../Components/Event/EventPage";
import { Box } from "@material-ui/core";
import { setUserCurrentLocation } from "../../Modules/userOperations";
// import CurrentCallActionsVertical from "../../Components/EventSession/CurrentCallActionsVertical";

export const SIDE_PANE_WIDTH = 0;
export const VERTICAL_NAV_WIDTH = 85;

const LEFT_PANE_WIDTH = 300;
const TOP_BAR_MOBILE = 56;
const TOP_BAR_NORMAL = 64;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: TOP_BAR_MOBILE,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: TOP_BAR_NORMAL
    },
    position: "relative",
    overflow: "hidden"
  },
  shiftContent: {
    paddingLeft: VERTICAL_NAV_WIDTH + LEFT_PANE_WIDTH
  },

  mainPane: ({ hasNavBarPaneOpen }) => ({
    position: "absolute",
    // height: "100%",
    top: TOP_BAR_NORMAL,
    bottom: 0,
    left: VERTICAL_NAV_WIDTH + (hasNavBarPaneOpen ? LEFT_PANE_WIDTH : 0),
    right: SIDE_PANE_WIDTH,
    backgroundColor: theme.palette.background.default,
    backgroundImage: "url('/Illustrations/EmptyNetworkingPane.svg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "20%",
    backgroundPosition: "98% 100%",
    [theme.breakpoints.down("xs")]: {
      right: 0,
      left: 0,
      top: TOP_BAR_MOBILE,
      backgroundSize: "50%"
    }
  }),
  noCall: {
    width: "100%",
    textAlign: "center",
    position: "absolute",
    // paddingLeft: "20%",
    top: "45%"
  },
  blueText: {
    color: "#274760"
  },
  greenText: {
    color: "#37C470"
  },
  emptyMessage: {
    // fontWeight: 500,
    width: 370,
    margin: "auto",
    textAlign: "left",
    maxWidth: "100%",
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(0, 1)
    }
  },
  sideMenu: {
    width: SIDE_PANE_WIDTH,
    top: TOP_BAR_NORMAL,
    backgroundColor: "white",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  verticalNav: {
    width: VERTICAL_NAV_WIDTH,
    top: TOP_BAR_NORMAL,
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    bottom: 0,
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  smallPlayerContainer: {
    position: "absolute",
    bottom: 0,
    // left: 0,
    right: SIDE_PANE_WIDTH,
    zIndex: 1201,
    height: SMALL_PLAYER_INITIAL_HEIGHT,
    width: SMALL_PLAYER_INITIAL_WIDTH,
    padding: theme.spacing(1)
    // borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },

  navBarPane: ({ hasNavBarPaneOpen }) => ({
    position: "absolute",
    left: VERTICAL_NAV_WIDTH,
    backgroundColor: "#fff",
    bottom: 0,
    top: TOP_BAR_NORMAL,
    width: LEFT_PANE_WIDTH,
    borderRight: "1px solid rgba(0, 0, 0, 0.12)"
  }),
  mainPaneScroll: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    overflow: "auto",
    padding: theme.spacing(2, 2),
    [theme.breakpoints.up("sm")]: {
      padding: theme.spacing(4, 2)
    }
  },
  callActionsContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    bottom: 80,
    display: "flex",
    alignItems: "center",
    // width: 300,
    // backgroundColor: theme.palette.background.default,
    // padding: theme.spacing(1, 0),
    borderRadius: "0 16px 0 0"
  },
  poweredByVeertly: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 120,
    cursor: "pointer"
  }
}));

const EventSessionContainer = (props) => {
  const theme = useTheme();
  const isDesktop = !useMediaQuery(theme.breakpoints.down("xs"));

  // const [openSidebar, setOpenSidebar] = useState(false);
  const history = useHistory();

  const { hasNavBarPaneOpen } = React.useContext(VerticalNavBarContext);
  const { jitsiApi, setJitsiApi } = React.useContext(JitsiContext);

  const classes = useStyles({ hasNavBarPaneOpen });

  const { sessionId: originalSessionId } = useParams();

  const sessionId = useMemo(
    () => (originalSessionId ? originalSessionId.toLowerCase() : null),
    [originalSessionId]
  );

  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const userGroup = useSelector(getUserGroup, shallowEqual);

  const isLive = React.useMemo(() => {
    if (
      !eventSessionDetails ||
      !eventSessionDetails.eventBeginDate ||
      !eventSessionDetails.eventOpens ||
      !eventSessionDetails.eventEndDate ||
      !eventSessionDetails.eventCloses
    ) {
      return true;
    }
    const {
      eventBeginDate,
      eventOpens,
      eventEndDate,
      eventCloses
    } = eventSessionDetails;

    const openMinutes = eventOpens
      ? Number(eventOpens)
      : DEFAULT_EVENT_OPEN_MINUTES;
    const beginDate = moment(eventBeginDate.toDate());

    let closeMinutes = eventCloses
      ? Number(eventCloses)
      : DEFAULT_EVENT_CLOSES_MINUTES;
    let endDate = moment(eventEndDate.toDate());

    return (
      beginDate.subtract(openMinutes, "minutes").isBefore(moment()) &&
      endDate.add(closeMinutes, "minutes").isAfter(moment())
    );
  }, [eventSessionDetails]);

  useEffect(() => {
    if (!isLive) {
      history.push(routes.EVENT_SESSION(sessionId));
    }
  }, [isLive, history, sessionId]);

  const userCurrentLocation = useSelector(getUserCurrentLocation);

  const smallPlayerBounds = React.useMemo(() => `.${classes.root}`, [
    classes.root
  ]);

  if (!eventSessionDetails) {
    return (
      <Page title="Veertly | Event not found">
        <div
          className={clsx({
            [classes.root]: true,
            [classes.shiftContent]: false
          })}
        >
          <EventSessionTopbar />
          <div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Typography
              align="center"
              variant="overline"
              style={{ display: "block" }}
            >
              Event not found!
            </Typography>
            {/* {user && !user.isAnonymous && ( */}
            <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  history.push(routes.CREATE_EVENT_SESSION());
                }}
              >
                Create Event
              </Button>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Page title={`Veertly | ${eventSessionDetails.title}`}> </Page>
      <EditProfileDialog />
      {/* <ShareEventDialog /> */}
      <FeedbackDialog />
      <JoinParticipantDialog />
      <JoinRoomDialog />
      <CreateRoomDialog />
      <RoomArchivedDialog />

      <EventSessionTopbar />

      {isLive && (
        <>
          <div className={classes.verticalNav}>
            <VerticalNavBar />
          </div>
          {hasNavBarPaneOpen && (
            <div className={classes.navBarPane}>
              <VerticalNavPane />
            </div>
          )}
          <div className={classes.mainPane}>
            {userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby && (
              <Box className={classes.mainPaneScroll}>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setUserCurrentLocation(
                        sessionId,
                        VERTICAL_NAV_OPTIONS.mainStage
                      )
                    }
                    style={{ marginBottom: 24 }}
                  >
                    Enter Main Stage
                  </Button>
                </div>
                <EventPage
                  event={eventSessionDetails}
                  hideButtons={true}
                  isPreview={true}
                />
              </Box>
            )}

            {userCurrentLocation === VERTICAL_NAV_OPTIONS.mainStage && (
              <ConferenceRoomContainer />
            )}
            {userGroup && (
              <>
                <NetworkingRoomContainer
                  jitsiApi={jitsiApi}
                  setJitsiApi={setJitsiApi}
                />
                {/* <Box className={classes.callActionsContainer}>
                  <CurrentCallActionsVertical />
                </Box> */}
              </>
            )}
            {!userGroup &&
              (userCurrentLocation === VERTICAL_NAV_OPTIONS.networking ||
                userCurrentLocation === VERTICAL_NAV_OPTIONS.rooms) && (
                <div className={classes.noCall}>
                  <Typography
                    variant="h6"
                    className={clsx(classes.blueText, classes.emptyMessage)}
                  >
                    You are not in any{" "}
                    <span className={classes.greenText}>conversation</span> yet,
                    <br />
                    don't be shy and{" "}
                    <span className={classes.greenText}>
                      select someone
                    </span> to <span className={classes.greenText}>talk</span>{" "}
                    to!
                  </Typography>
                </div>
              )}
            {!userGroup &&
              (userCurrentLocation === VERTICAL_NAV_OPTIONS.networking ||
                userCurrentLocation === VERTICAL_NAV_OPTIONS.rooms ||
                userCurrentLocation === VERTICAL_NAV_OPTIONS.lobby) && (
                <a
                  href="https://veertly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="Powered by Veertly"
                    src={PoweredByVeertly}
                    className={classes.poweredByVeertly}
                  />
                </a>
              )}
          </div>
          <SmallPlayerContainer bounds={smallPlayerBounds} />
        </>
      )}
    </div>
  );
};

// EventSessionContainer.whyDidYouRender = true;

export default EventSessionContainer;
