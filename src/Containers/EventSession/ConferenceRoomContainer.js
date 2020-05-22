import React, { useState, useEffect, useContext } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";
import NoVideoImage from "../../Assets/illustrations/undraw_video_call_kxyp.svg";
import { Typography } from "@material-ui/core";
import { ANNOUNCEMENT_HEIGHT } from "../../Components/EventSession/Announcements";
import { useSelector, shallowEqual } from "react-redux";
import {
  getUser,
  getUserGroup,
  getSessionId,
  getUserId,
  getEventSessionDetails,
  getFeatureDetails
} from "../../Redux/eventSession";
import ReactPlayer from "react-player";
import CircularProgress from "@material-ui/core/CircularProgress";
import JitsiContext from "./JitsiContext";
import { trackPage } from "../../Modules/analytics";
import {
  getJistiServer,
  getJitsiOptions,
  getJistiDomain,
  isMeetJitsi
} from "../../Modules/jitsi";
import { setOffline } from "../../Modules/userOperations";
import { useHistory } from "react-router-dom";
import routes from "../../Config/routes";
import { FEATURES } from "../../Modules/features";

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    width: "100%",
    height: "100%"
  },
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  noVideoImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    bottom: 0,
    margin: "auto",
    width: "100%",
    height: "60%"
  },
  reactPlayerContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    paddingTop: "56.25%" /* Player ratio: 100 / (1280 / 720) */,
    backgroundColor: "black"
    // display: "flex",
    // alignItems: "center",
  },
  reactPlayer: {
    position: "absolute",
    margin: 0,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
}));

export default () => {
  const classes = useStyles();

  const { jitsiApi, setJitsiApi } = useContext(JitsiContext);

  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);
  const [loadingPlayer, setLoadingPlayer] = useState(true);

  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const history = useHistory();

  const [loaded, error] = useScript(
    getJistiServer(eventSessionDetails) + "external_api.js"
  );

  useEffect(() => {
    trackPage("ConferenceRoom/" + sessionId);
  }, [sessionId]);

  const handleCallEnded = React.useCallback(async () => {
    await leaveCall(sessionId, userGroup, userId);
    await setOffline(sessionId, userGroup);
    history.push(routes.EVENT_SESSION(sessionId));
  }, [sessionId, userGroup, userId, history]);

  const removeJitsiLogoFeature = useSelector(
    getFeatureDetails(FEATURES.REMOVE_JITSI_LOGO),
    shallowEqual
  );

  useEffect(() => {
    if (!user) {
      return;
    }
    let prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
    let prefixStr = prefix !== undefined ? `-${prefix}` : "";

    const roomName = "veertly" + prefixStr + "-" + sessionId;

    if (
      eventSessionDetails.conferenceVideoType === "JITSI" &&
      loaded &&
      lastRoomLoaded !== roomName
    ) {
      // dispose existing jitsi
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }

      const domain = getJistiDomain(eventSessionDetails);

      const showJitsiLogo =
        isMeetJitsi(domain) &&
        (!removeJitsiLogoFeature || !removeJitsiLogoFeature.enabled);

      const options = getJitsiOptions(
        roomName,
        document.querySelector("#conference-container"),
        true,
        false,
        showJitsiLogo
      );

      /*eslint-disable no-undef*/
      const api = new JitsiMeetExternalAPI(domain, options);
      /*eslint-enable no-undef*/
      api.executeCommand("displayName", user.firstName + " " + user.lastName);
      api.executeCommand("subject", `Veertly | ${eventSessionDetails.title}`);

      if (user.avatarUrl) {
        api.executeCommand("avatarUrl", user.avatarUrl);
      }
      api.addEventListener("videoConferenceLeft", (event) => {
        // console.log("videoConferenceLeft: ", event);
        // handleCallEnded();
      });
      api.addEventListener("readyToClose", (event) => {
        // console.log("readyToClose: ", event);
        handleCallEnded();
      });

      setLastRoomLoaded(roomName);
      setJitsiApi(api);
    }
    return () => {
      // if (jitsiApi) {
      //   console.log("ON DISPOSE");
      //   jitsiApi.executeCommand("hangup");
      //   jitsiApi.dispose();
      // }
    };
  }, [
    loaded,
    eventSessionDetails,
    user,
    handleCallEnded,
    jitsiApi,
    lastRoomLoaded,
    setJitsiApi,
    sessionId,
    removeJitsiLogoFeature
  ]);

  const hasAnnouncement = React.useMemo(
    () =>
      eventSessionDetails &&
      eventSessionDetails.announcements &&
      eventSessionDetails.announcements.conference &&
      eventSessionDetails.announcements.conference.trim() !== "",
    [eventSessionDetails]
  );
  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
    const getYoutubeFrame = () => {
      let videoId = eventSessionDetails.conferenceRoomYoutubeVideoId;
      return (
        <div
          className={classes.root}
          style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
        >
          <iframe
            className={classes.videoContainer}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&fs=0&modestbranding=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="livestream"
          ></iframe>
        </div>
      );
    };

    const getFacebookFrame = () => {
      let facebookVideoId = eventSessionDetails.conferenceRoomFacebookVideoId;
      let facebookUrl = eventSessionDetails.conferenceRoomFacebookLink;
      let url = facebookUrl
        ? facebookUrl
        : `https://www.facebook.com/facebook/videos/${facebookVideoId}`;
      return (
        <div
          className={classes.root}
          style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
        >
          <div className={classes.reactPlayerContainer}>
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              // height="none"
              className={classes.reactPlayer}
              // playing
              controls={true}
              onReady={() => setLoadingPlayer(false)}
            />
            {loadingPlayer && (
              <div className={classes.reactPlayer}>
                <CircularProgress color="secondary" />
              </div>
            )}
          </div>
        </div>
      );
    };

    switch (eventSessionDetails.conferenceVideoType) {
      case "YOUTUBE":
        return getYoutubeFrame();
      case "FACEBOOK":
        return getFacebookFrame();
      case "JITSI":
        return <div id="conference-container" className={classes.root} />;
      default:
        return (
          <div className={classes.videoContainer}>
            <Typography align="center" gutterBottom style={{ marginTop: 64 }}>
              Livestream not correctly configured...
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Please contact the event organizer or Veertly team
            </Typography>
            <img
              alt="No Video available"
              src={NoVideoImage}
              className={classes.noVideoImage}
            />
          </div>
        );
    }
  }
};
