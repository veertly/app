import React, { useState, useEffect, useContext } from "react";
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
  getFeatureDetails,
} from "../../Redux/eventSession";
import ReactPlayer from "react-player";
import CircularProgress from "@material-ui/core/CircularProgress";
import JitsiContext from "../../Contexts/JitsiContext";
import { trackPage } from "../../Modules/analytics";
import {
  getJistiServer,
  getJitsiOptions,
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
import { usePrevious } from "react-use";
import TechnicalCheckContext from "./TechnicalCheckContext";
import AudioVideoCheckDialog from "../../Components/EventSession/AudioVideoCheckDialog";

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
  const { showAudioVideoCheck, muteVideo, muteAudio, setMuteAudio, setMuteVideo } = useContext(TechnicalCheckContext);

  const previousMuteVideo = usePrevious(muteVideo);
  const previousMuteAudio = usePrevious(muteAudio);

  const [lastRoomLoaded, setLastRoomLoaded] = useState(null);
  const [loadingPlayer, setLoadingPlayer] = useState(true);

  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  // const history = useHistory();
  // const [eventSessionData] = useDocumentDataOnce(
  //   firebase
  //   .firestore()
  //   .collection("eventSessions")
  //   .doc(sessionId)
  // )

  // const muteVideo = useSelector(getMuteVideoOnEnter)
  // const muteAudio = useSelector(getMuteAudioOnEnter);

  // const history = useHistory();

  const [loaded, error] = useScript(
    getJistiServer(eventSessionDetails) + "external_api.js"
  );

  useEffect(() => {
    trackPage("ConferenceRoom/" + sessionId);
  }, [sessionId]);

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

  useEffect(() => {
    if (!user) {
      return;
    }
    if (showAudioVideoCheck) {
      return;
    }
    let prefix = process.env.REACT_APP_JITSI_ROOM_PREFIX;
    let prefixStr = prefix !== undefined ? `-${prefix}` : "";

    const roomName = "veertly" + prefixStr + "-" + sessionId;

    if (eventSessionDetails.conferenceVideoType !== "JITSI" && loaded) {
      // dispose existing jitsi
      if (jitsiApi) {
        jitsiApi.executeCommand("hangup");
        jitsiApi.dispose();
        setLastRoomLoaded(null);
      }
    }

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
      api.executeCommand("subject", "Main Stage");

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

      // api.addEventListener("audioMuteStatusChanged", (event) => {
      //   console.log("mute audio => ",event);
      //   setMuteAudio(event.muted)
      // });
      
      // api.addEventListener("videoMuteStatusChanged", (event) => {
      //   // console.log("mute video",event);
      //   setMuteVideo(event.muted);
      // });


      if (muteAudio) {
        api.executeCommand("toggleAudio");
      }

      if (muteVideo) {
        api.executeCommand("toggleVideo");
      }

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
    removeJitsiLogoFeature,
    muteAudio,
    muteVideo,
    setMuteAudio,
    setMuteVideo,
    showAudioVideoCheck,
  ]);

  useEffect(() => {
    if (jitsiApi) {   
      if (previousMuteVideo !== muteVideo) {
        jitsiApi.executeCommand("toggleVideo");
      } 
    }
  }, [
    jitsiApi,
    muteVideo,
    previousMuteVideo
  ]);

  useEffect(() => {
    if (jitsiApi) {  
      if (previousMuteAudio !== muteAudio) {
        jitsiApi.executeCommand("toggleAudio");   
      }  
    }
  }, [
    jitsiApi,
    muteAudio,
    previousMuteAudio
  ]);


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
        return (
          <>
            <div id="conference-container" className={classes.root} />
            <AudioVideoCheckDialog
              title="Main Stage conference call"
              subtitle="You are about enter to the main stage conference call. Please ensure that mic and camera are working properly."
              sessionId={sessionId} 
              showClose
              onCloseClicked={() => {
                setUserCurrentLocation(sessionId, VERTICAL_NAV_OPTIONS.lobby)
              }}
            />
          </>
        )
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
