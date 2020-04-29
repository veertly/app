import React, { useEffect, useState } from "react";
import useScript from "../../Hooks/useScript";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import {
  getSessionId,
  getEventSessionDetails } from "../../Redux/eventSession";
import FacebookPlayer from "../../Components/EventSession/FacebookPlayer";
import YoutubePlayer from "../../Components/EventSession/YoutubePlayer";
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import CloseIcon from '@material-ui/icons/Close';
import Slider from '@material-ui/core/Slider';

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
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
    paddingBottom: theme.spacing(0.4),
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
    alignItems: 'center',
    justifyContent: 'space-around',
    "& > * + *" : {
      marginLeft: theme.spacing(0.8),
    }
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    }
  },
  toolbarTitle: {
    flex: 0.4,
    fontWeight: 600,
  },
  slider: {
    color: 'white',
  }
}));

const CustomYoutubeFrame = ({ videoId, volume }) => {
  const classes = useStyles(); 
  return (
    <div className={classes.root}
    // style={{ top: hasAnnouncement ? ANNOUNCEMENT_HEIGHT : 0 }}
    >
     <YoutubePlayer volume={volume} videoId={videoId} />
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
  // const { jitsiApi, setJitsiApi } = useContext(JitsiContext);

  const [loaded, error] = useScript("https://meet.jit.si/external_api.js");
  // const [loadedFacebookStream /* , errorFacebookStream */] = useScript(
  //   "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"
  // );

  const [volume, setVolume] = useState(50)

  // const userId = useSelector(getUserId);
  // const user = useSelector(getUser);
  // const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  
  const [closePlayer, setClosePlayer] = useState(eventSessionDetails.conferenceVideoType === 'JITSI' ? true : false);

  useEffect(() => {
    window.analytics.page("ConferenceRoom/" + sessionId);
  }, [sessionId]);

  // const handleCallEnded = React.useCallback(() => {
  //   leaveCall(sessionId, userGroup, userId);
  // }, [sessionId, userGroup, userId]);

  // useJitsi({
  //   avatarUrl: user ? user.avatarUrl : "",
  //   displayName: user ? user.firstName + " " + user.lastName : "",
  //   sessionId,
  //   conferenceVideoType: eventSessionDetails.conferenceVideoType,
  //   containerId: '#conference-container',
  //   jitsiApi,
  //   setJitsiApi,
  //   callEndedCb: () => handleCallEnded()
  // })

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const getPlayer = () => {
    const vol = Math.floor(volume * 10 / 100) / 10;
    switch (eventSessionDetails.conferenceVideoType) {
      case "YOUTUBE":
        let youtubeVideoId = eventSessionDetails.conferenceRoomYoutubeVideoId;
        return <CustomYoutubeFrame volume={vol} videoId={youtubeVideoId} />;
      case "FACEBOOK":
        let facebookVideoId = eventSessionDetails.conferenceRoomFacebookVideoId;
        return <CustomFacebookFrame  videoId={facebookVideoId} />;
      // case "JITSI":
      //   return <div id="conference-container" className={classes.root} />;
      default:
        return null;
    }
  }

  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }
  if (!loaded) return null;

  if(closePlayer) return null;

  if (loaded) {
    return (
      <div className={classes.playerOuterContainer}>
        <div className={classes.toolbar}>
          <div className={classes.toolbarTitle}>
            <Typography variant="subtitle1">
              Main Stage
            </Typography>
          </div>
          <div className={classes.volumeControlContainer}>
            <VolumeDownIcon className={classes.icon} />
              <Slider className={classes.slider} value={volume} onChange={handleVolumeChange} aria-labelledby="continuous-slider" />
            <VolumeUpIcon className={classes.icon} />
            <CloseIcon className={classes.icon} onClick={() => setClosePlayer(true)}></CloseIcon>
          </div>
        </div>
        <div className={classes.playerContainer}>
          {getPlayer()}
        </div>
      </div>
    )

 
  }
};

export default SmallPlayerContainer;
