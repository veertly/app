import React, { useEffect, useState, useContext } from "react";
// import useScript from "../../Hooks/useScript";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { useSelector, shallowEqual } from "react-redux";
import { getEventSessionDetails } from "../../Redux/eventSession";
import VideoPlayer from "../../Components/EventSession/VideoPlayer";
// import VolumeDownIcon from '@material-ui/icons/VolumeDown';
// import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import CloseIcon from "@material-ui/icons/Remove";
// import Slider from '@material-ui/core/Slider';
import { Rnd } from "react-rnd";
import {
  SMALL_PLAYER_INITIAL_HEIGHT,
  SMALL_PLAYER_INITIAL_WIDTH,
  TOPBAR_HEIGHT,
} from "../../Utils";
import JitsiContext from "./JitsiContext";
import { SIDE_PANE_WIDTH } from "./EventSessionContainer";
import useWindowSize from "../../Hooks/useWindowSize";
import { Tooltip } from "@material-ui/core";
import { trackEvent } from "../../Modules/analytics";

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
    display: "flex",
    flexDirection: "column",
    zIndex: 1300,
    "-webkit-box-shadow": "0px 0px 64px -20px rgba(0,0,0,0.75)",
    "-moz-box-shadow": "0px 0px 64px -20px rgba(0,0,0,0.75)",
    "box-shadow": "0px 0px 64px -20px rgba(0,0,0,0.75)",
  },
  toolbar: {
    width: "100%",
    // flex: 0.15,
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: "#486981",
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
    paddingBottom: theme.spacing(0.4),
  },
  playerContainer: {
    width: "100%",
    flex: 1,
    position: "relative",
  },
  volumeControlContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(0.8),
    },
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  toolbarTitle: {
    // flex: 0.4,
    fontWeight: 600,
  },
  slider: {
    color: "white",
  },
  toolbarClosed: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
}));

const CustomYoutubeFrame = ({ videoId, volume }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <VideoPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        volume={volume}
      />
    </div>
  );
};

const CustomFacebookFrame = ({ url, volume }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <VideoPlayer volume={volume} showLoader url={url} />
    </div>
  );
};

export const SmallPlayerContainer = ({ bounds = "" }) => {
  const classes = useStyles();
  // const { jitsiApi, setJitsiApi } = useContext(JitsiContext);

  // const [loaded, error] = useScript("https://meet.jit.si/external_api.js");
  // const [loadedFacebookStream /* , errorFacebookStream */] = useScript(
  //   "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"
  // );

  const [volume] = useState(50);

  const [playerPosition, setPlayerPosition] = useState({
    x: window.innerWidth - SMALL_PLAYER_INITIAL_WIDTH - SIDE_PANE_WIDTH,
    y: TOPBAR_HEIGHT, // window.innerHeight - SMALL_PLAYER_INITIAL_HEIGHT,
  });

  const [playerSize, setPlayerSize] = useState({
    width: SMALL_PLAYER_INITIAL_WIDTH,
    height: SMALL_PLAYER_INITIAL_HEIGHT,
  });

  const windowSize = useWindowSize();

  useEffect(() => {
    let { width, height } = playerSize;
    let { x, y } = playerPosition;

    if (x + width > windowSize.width) {
      setPlayerPosition({ ...playerPosition, x: windowSize.width - width });
    }

    if (y + height > windowSize.height) {
      setPlayerPosition({ ...playerPosition, y: windowSize.height - height });
    }
  }, [windowSize, playerSize, playerPosition]);

  // const userId = useSelector(getUserId);
  // const user = useSelector(getUser);
  // const userGroup = useSelector(getUserGroup, shallowEqual);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const { showSmallPlayer, setShowSmallPlayer, miniPlayerEnabled } = useContext(
    JitsiContext
  );

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

  // const handleVolumeChange = (event, newValue) => {
  //   setVolume(newValue);
  // };

  const getPlayer = () => {
    const vol = Math.floor((volume * 10) / 100) / 10;
    switch (eventSessionDetails.conferenceVideoType) {
      case "YOUTUBE":
        let youtubeVideoId = eventSessionDetails.conferenceRoomYoutubeVideoId;
        return <CustomYoutubeFrame volume={vol} videoId={youtubeVideoId} />;
      case "FACEBOOK":
        let facebookVideoId = eventSessionDetails.conferenceRoomFacebookVideoId;
        let facebookUrl = eventSessionDetails.conferenceRoomFacebookLink;
        let url = facebookUrl
          ? facebookUrl
          : `https://www.facebook.com/facebook/videos/${facebookVideoId}`;
        return <CustomFacebookFrame volume={vol} url={url} />;
      // case "JITSI":
      //   return <div id="conference-container" className={classes.root} />;
      default:
        return null;
    }
  };

  if (!miniPlayerEnabled) {
    return null;
  }

  // if (error) {
  //   console.log(error);
  //   return <p>Error :(</p>;
  // }
  // if (!loaded) return null;

  if (!showSmallPlayer) return null;

  if (eventSessionDetails.conferenceVideoType === "JITSI") {
    return null;
  }
  // if (loaded) {
  return (
    <Rnd
      // default={{
      //   // x: window.innerWidth - SMALL_PLAYER_INITIAL_WIDTH - SIDE_PANE_WIDTH,
      //   // y: window.innerHeight - SMALL_PLAYER_INITIAL_HEIGHT,
      //   width: SMALL_PLAYER_INITIAL_WIDTH,
      //   height: SMALL_PLAYER_INITIAL_HEIGHT,
      // }}
      size={playerSize}
      position={playerPosition}
      bounds={bounds}
      lockAspectRatio={false}
      className={classes.playerOuterContainer}
      onDragStop={(e, d) => {
        setPlayerPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setPlayerPosition(position);

        setPlayerSize({
          width: ref.style.width,
          height: ref.style.height,
        });
      }}
    >
      <div className={classes.playerOuterContainer}>
        <div className={classes.toolbar}>
          <div className={classes.toolbarTitle}>
            <Typography variant="subtitle1">Main Stage</Typography>
          </div>
          <div className={classes.volumeControlContainer}>
            {/* <VolumeDownIcon className={classes.icon} />
                <Slider className={classes.slider} value={volume} onChange={handleVolumeChange} aria-labelledby="continuous-slider" />
              <VolumeUpIcon className={classes.icon} /> */}
            <Tooltip title="Minimize player">
              <CloseIcon
                className={classes.icon}
                onClick={() => {
                  setShowSmallPlayer(false);
                  trackEvent("Mini player minimized", {});
                }}
              />
            </Tooltip>
          </div>
        </div>
        <div className={classes.playerContainer}>{getPlayer()}</div>
      </div>
    </Rnd>
  );
};

export default SmallPlayerContainer;
