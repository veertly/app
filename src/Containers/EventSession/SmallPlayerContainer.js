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
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import CloseIcon from '@material-ui/icons/Close';

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
  playerOuterContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  toolbar: {
    width: '100%',
    flex: 0.1,
    backgroundColor: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  playerContainer: {
    width: '100%',
    flex: 0.9,
    position: 'relative',
  },
  volumeControlContainer: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
}));

const CustomYoutubeFrame = ({ videoId }) => {
  const classes = useStyles(); 
  return (
    <div className={classes.root}
    // style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
    >
     <YoutubePlayer videoId={videoId} />
    </div>
  );
};

const CustomFacebookFrame = ({ videoId }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}
    // style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
    >
      <FacebookPlayer videoId={videoId} />
    </div>
  );
};

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

  const getPlayer = () => {
    switch (eventSessionDetails.conferenceVideoType) {
      case "YOUTUBE":
        let youtubeVideoId = eventSessionDetails.conferenceRoomYoutubeVideoId;
        return <CustomYoutubeFrame videoId={youtubeVideoId} />;
      case "FACEBOOK":
        let facebookVideoId = eventSessionDetails.conferenceRoomFacebookVideoId;
        return <CustomFacebookFrame  videoId={facebookVideoId} />;
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

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return <div id="conference-container">Loading...</div>;
  if (loaded) {
  
    return (
      <div className={classes.playerOuterContainer}>
        <div className={classes.toolbar}>
          <div className={classes.volumeControlContainer}>
            <VolumeDownIcon />
            <VolumeUpIcon />
            <VolumeOffIcon />
          </div>
          <CloseIcon></CloseIcon>
        </div>
        <div className={classes.playerContainer}>
          {getPlayer()}
        </div>
      </div>
    )

 
  }
};

export default SmallPlayerContainer;