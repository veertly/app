import React, { useState, useEffect, useMemo, useContext } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";
import NoVideoImage from "../../Assets/illustrations/undraw_video_call_kxyp.svg";
import { Typography } from "@material-ui/core";
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
// import JitsiContext from "../../Contexts/JitsiContext";
import { trackPage } from "../../Modules/analytics";
import {
  getJistiServer,
  // getJitsiOptions,
  getJistiDomain,
  isMeetJitsi
} from "../../Modules/jitsi";
import {
  // setOffline,
  setUserCurrentLocation
} from "../../Modules/userOperations";
// import { useHistory } from "react-router-dom";
import { FEATURES } from "../../Modules/features";
import { VERTICAL_NAV_OPTIONS } from "../../Contexts/VerticalNavBarContext";
// import { usePrevious } from "react-use";
// import TechnicalCheckContext from "../../Contexts/TechnicalCheckContext";
import AudioVideoCheckDialog from "../../Components/EventSession/AudioVideoCheckDialog";
import JitsiPlayerComponent from "../../Components/EventSession/JitsiPlayerComponent";
import JitsiContext from "../../Contexts/JitsiContext";

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
  const [loadingPlayer, setLoadingPlayer] = useState(true);

  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const [loaded, error] = useScript(
    getJistiServer(eventSessionDetails) + "external_api.js"
  );

  useEffect(() => {
    trackPage("ConferenceRoom/" + sessionId);
  }, [sessionId]);

  const { jitsiApi } = useContext(JitsiContext);

  useEffect(() => {
    if (eventSessionDetails.conferenceVideoType !== "JITSI") {
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
      }
    }
  }, [eventSessionDetails.conferenceVideoType, jitsiApi]);

  const handleCallEnded = React.useCallback(async () => {
    await leaveCall(sessionId, userGroup, userId);
    // await setOffline(sessionId, userGroup);
    // history.push(routes.EVENT_SESSION(sessionId));
    setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.lobby);
  }, [sessionId, userGroup, userId]);

  const removeJitsiLogoFeature = useSelector(
    getFeatureDetails(FEATURES.REMOVE_JITSI_LOGO),
    shallowEqual
  );

  const customNavBarFeature = useSelector(
    getFeatureDetails(FEATURES.CUSTOM_NAV_BAR),
    shallowEqual
  );

  const mainStageTitle = useMemo(() => {
    if (
      customNavBarFeature &&
      customNavBarFeature[VERTICAL_NAV_OPTIONS.mainStage]
    ) {
      return customNavBarFeature[VERTICAL_NAV_OPTIONS.mainStage].label;
    }
    return "Main Stage";
  }, [customNavBarFeature]);

  const prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
  const prefixStr = prefix !== undefined ? `-${prefix}` : "";
  const roomName = "veertly" + prefixStr + "-" + sessionId;
  const domain = getJistiDomain(eventSessionDetails);
  const subject = mainStageTitle;
  const showJitsiLogo =
    isMeetJitsi(domain) &&
    (!removeJitsiLogoFeature || !removeJitsiLogoFeature.enabled);

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
    const getYoutubeFrame = () => {
      let videoId = eventSessionDetails.conferenceRoomYoutubeVideoId;
      return (
        <div className={classes.root}>
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
        <div className={classes.root}>
          <div className={classes.reactPlayerContainer}>
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              // height="none"
              className={classes.reactPlayer}
              playing
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
        return (
          <>
            <div className={classes.root}>
              <JitsiPlayerComponent
                avatarUrl={user.avatarUrl}
                displayName={user.firstName + " " + user.lastName}
                sessionId={sessionId}
                // containerId= "#conference-container"
                domain={domain}
                showJitsiLogo={showJitsiLogo}
                subject={subject}
                roomName={roomName}
                callEndedCb={handleCallEnded}
              />
            </div>
            <AudioVideoCheckDialog
              title="Main Stage conference call"
              subtitle="You are about enter to the main stage conference call. Please ensure that mic and camera are working properly."
              sessionId={sessionId}
              showClose
              onCloseClicked={() => {
                setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.lobby);
              }}
            />
          </>
        );
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
