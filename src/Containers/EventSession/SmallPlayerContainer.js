import React, { useEffect, useContext } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { leaveCall } from "../../Modules/eventSessionOperations";
import NoVideoImage from "../../Assets/illustrations/undraw_video_call_kxyp.svg";
import { Typography } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import { getUser, getUserGroup, getSessionId, getUserId, getEventSessionDetails } from "../../Redux/eventSession";
import JitsiContext from "./JitsiContext";
import useJitsi from "../../Hooks/useJitsi";
import FacebookPlayer from "../../Components/EventSession/FacebookPlayer";
import YoutubePlayer from "../../Components/EventSession/YoutubePlayer";

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    width: "100%",
    height: "100%",
  },
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  noVideoImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    bottom: 0,
    margin: "auto",
    width: "100%",
    height: "60%",
  },
  reactPlayerContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    // paddingTop: "56.25%" /* Player ratio: 100 / (1280 / 720) */,
    backgroundColor: "black",
    // display: "flex",
    // alignItems: "center",
  },
  reactPlayer: {
    position: "absolute",
    margin: 0,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export const SmallPlayerContainer =  () => {
  const classes = useStyles();
  const { jitsiApi, setJitsiApi } = useContext(JitsiContext);

  const [loaded, error] = useScript("https://meet.jit.si/external_api.js");
  // const [loadedFacebookStream /* , errorFacebookStream */] = useScript(
  //   "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"
  // );

  const userId = useSelector(getUserId);
  const user = useSelector(getUser);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  useEffect(() => {
    window.analytics.page("ConferenceRoom/" + sessionId);
  }, [sessionId]);

  const handleCallEnded = React.useCallback(() => {
    leaveCall(sessionId, userGroup, userId);
  }, [sessionId, userGroup, userId]);

  useJitsi({
    avatarUrl: user ? user.avatarUrl : "",
    displayName: user ? user.firstName + " " + user.lastName : "",
    sessionId,
    conferenceVideoType: eventSessionDetails.conferenceVideoType,
    containerId: '#conference-container',
    jitsiApi,
    setJitsiApi,
    callEndedCb: () => handleCallEnded()
  })

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
    const getYoutubeFrame = (videoId) => {
      return (
        <div className={classes.root}
        // style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
        >
         <YoutubePlayer videoId={videoId} />
        </div>
      );
    };

    const getFacebooFrame = (videoId) => {
      return (
        <div className={classes.root}
        // style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
        >
          <FacebookPlayer videoId={videoId} />
        </div>
      );
    };
    switch (eventSessionDetails.conferenceVideoType) {
      case "YOUTUBE":
        let youtubeVideoId = eventSessionDetails.conferenceRoomYoutubeVideoId;
        return getYoutubeFrame(youtubeVideoId);
      case "FACEBOOK":
        let facebookVideoId = eventSessionDetails.conferenceRoomFacebookVideoId;
        return getFacebooFrame(facebookVideoId);

      case "JITSI":
        return <div id="conference-container" className={classes.root} />;
      default:
        return (
          <div className={classes.videoContainer}>
            <Typography align="center" gutterBottom style={{ marginTop: 16 }}>
              Livestream not correctly configured...
            </Typography>
            <Typography variant="caption" display="block" align="center">
              Please contact the event organizer or Veertly team
            </Typography>
            <img alt="No Video available" src={NoVideoImage} className={classes.noVideoImage} />
          </div>
        );
    }
  }
};

export default SmallPlayerContainer;
