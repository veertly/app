import React, { useEffect, useState, useContext, useMemo } from "react";
// import useScript from "../../Hooks/useScript";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { useSelector, shallowEqual } from "react-redux";
import {
  getEventSessionDetails,
  getSessionId,
  getFeatureDetails
} from "../../Redux/eventSession";
import VideoPlayer from "../../Components/EventSession/VideoPlayer";
// import VolumeDownIcon from '@material-ui/icons/VolumeDown';
// import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import CloseIcon from "@material-ui/icons/Remove";
// import Slider from '@material-ui/core/Slider';
import { Rnd } from "react-rnd";
import {
  SMALL_PLAYER_INITIAL_HEIGHT,
  SMALL_PLAYER_INITIAL_WIDTH
} from "../../Utils";
import { SIDE_PANE_WIDTH } from "./EventSessionContainer";
import useWindowSize from "../../Hooks/useWindowSize";
import { Tooltip } from "@material-ui/core";
import { trackEvent } from "../../Modules/analytics";
import SmallPlayerContext from "../../Contexts/SmallPlayerContext";
import { useLocalStorage } from "react-use";
import { FEATURES } from "../../Modules/features";
import { VERTICAL_NAV_OPTIONS } from "../../Contexts/VerticalNavBarContext";

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
    "box-shadow": "0px 0px 64px -20px rgba(0,0,0,0.75)"
  },
  toolbar: {
    width: "100%",
    // flex: 0.15,
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light, //"#486981",
    color: theme.palette.getContrastText(theme.palette.primary.light), //"white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(1),
    // paddingTop: theme.spacing(1.5),
    // paddingBottom: theme.spacing(1.5)
  },
  dragInitiater: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "move",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.7),
    paddingBottom: theme.spacing(0.7)
  },
  divider: {
    width: "100%"
  },
  playerContainer: {
    width: "100%",
    flex: 1,
    position: "relative",
    borderStyle: "solid",
    borderWidth: theme.spacing(0.5),
    borderColor: theme.palette.primary.light //"#486981"
  },
  volumeControlContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(0.8)
    }
  },
  icon: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  toolbarTitle: {
    // flex: 0.4,
    fontWeight: 600
  },
  slider: {
    color: "white"
  },
  toolbarClosed: {
    position: "absolute",
    left: 0,
    bottom: 0
  }
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

  const sessionId = useSelector(getSessionId);

  const [volume] = useState(50);

  const [playerPosition, setPlayerPosition] = useLocalStorage(
    `veertly/${sessionId}/player-position`,
    {
      x: window.innerWidth - SMALL_PLAYER_INITIAL_WIDTH - SIDE_PANE_WIDTH,
      y:
        /* TOPBAR_HEIGHT //  */ window.innerHeight - SMALL_PLAYER_INITIAL_HEIGHT
    }
  );

  const [playerSize, setPlayerSize] = useState({
    width: SMALL_PLAYER_INITIAL_WIDTH,
    height: SMALL_PLAYER_INITIAL_HEIGHT
  });

  const windowSize = useWindowSize();

  // HACK: Controlling position from dragCallback Coordinates
  // As YTPlayer was intercepts all the events it was causing issues because cancel
  // event was not being passed to react-draggable.
  // This is a hack: which set disableDragging to false when player wrapper receives
  // move event.
  // At this point we keep the previous value in dragCallCoordinates and
  // set these values in onDragEnd.
  // Related issue in react-draggable. (Workaround)
  // https://github.com/STRML/react-draggable/issues/486

  const [disableDragging, setDisableDragging] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [dragCallbackCoordinates, setDragCallbackCoordinates] = useState({
    x: -1,
    y: -1
  });

  useEffect(() => {
    let { width, height } = playerSize;
    let { x, y } = playerPosition;

    if (x + width > windowSize.width) {
      setPlayerPosition({ ...playerPosition, x: windowSize.width - width });
    }

    if (y + height > windowSize.height) {
      setPlayerPosition({ ...playerPosition, y: windowSize.height - height });
    }
  }, [windowSize, playerSize, playerPosition, setPlayerPosition]);

  // const userId = useSelector(getUserId);
  // const user = useSelector(getUser);
  // const userGroup = useSelector(getUserGroup, shallowEqual);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const { showSmallPlayer, minimizePlayer, miniPlayerEnabled } = useContext(
    SmallPlayerContext
  );

  const vol = React.useMemo(() => Math.floor((volume * 10) / 100) / 10, [
    volume
  ]);

  const player = React.useMemo(() => {
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
  }, [eventSessionDetails, vol]);

  const handleResizeStop = React.useCallback(
    (e, direction, ref, delta, position) => {
      setPlayerPosition(position);

      setPlayerSize({
        width: ref.style.width,
        height: ref.style.height
      });
    },
    [setPlayerPosition]
  );

  const handleDragStop = React.useCallback(
    (e, d) => {
      // console.log("drag stop");
      // if (dragCallbackCoordinates.x > 0 && dragCallbackCoordinates.y > 0) {
      setPlayerPosition({
        x: dragCallbackCoordinates.x,
        y: dragCallbackCoordinates.y
      });
      // }
      setIsDragging(false);
      setDisableDragging(false);
    },
    [setPlayerPosition, dragCallbackCoordinates.x, dragCallbackCoordinates.y]
  );

  const handleDrag = React.useCallback(
    (e, d) => {
      if (d.x >= 0 && d.y >= 0) {
        // setPlayerPosition({ x: d.x, y: d.y });
        setDragCallbackCoordinates({
          x: d.x,
          y: d.y
        });
      }

      // console.log(disableDragging, isDragging);
      if (disableDragging) {
        return false;
      }
    },
    [setDragCallbackCoordinates, disableDragging]
  );

  const handleDragStart = React.useCallback(() => {
    setIsDragging(true);
    // console.log("drag start")
  }, [setIsDragging]);

  const handleMouseDown = React.useCallback(() => {
    if (disableDragging) {
      setDisableDragging(false);
    }
    // console.log("mouse down rnd")
  }, [disableDragging, setDisableDragging]);

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

  // console.log("disable dragging => ", disableDragging)
  // console.log(classes.toolbar);
  const miniPlayer = React.useMemo(
    () => (
      <Rnd
        // default={{
        //   // x: window.innerWidth - SMALL_PLAYER_INITIAL_WIDTH - SIDE_PANE_WIDTH,
        //   // y: window.innerHeight - SMALL_PLAYER_INITIAL_HEIGHT,
        //   width: SMALL_PLAYER_INITIAL_WIDTH,
        //   height: SMALL_PLAYER_INITIAL_HEIGHT,
        // }}
        onDragStart={handleDragStart}
        onMouseDown={handleMouseDown}
        size={playerSize}
        position={playerPosition}
        bounds={bounds}
        lockAspectRatio={false}
        className={classes.playerOuterContainer}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        // disableDragging={disableDragging}
        onResizeStop={handleResizeStop}
        dragHandleClassName={classes.dragInitiater}
        cancel={`.${classes.playerContainer}, .body, ${bounds}, .${classes.divider}`}
      >
        <div className={classes.playerOuterContainer}>
          <div className={classes.toolbar}>
            <div className={classes.dragInitiater}>
              <div className={classes.toolbarTitle}>
                <Typography variant="subtitle1">{mainStageTitle}</Typography>
              </div>
              <div className={classes.volumeControlContainer}>
                {/* <VolumeDownIcon className={classes.icon} />
                <Slider className={classes.slider} value={volume} onChange={handleVolumeChange} aria-labelledby="continuous-slider" />
              <VolumeUpIcon className={classes.icon} /> */}
                <Tooltip title="Minimize player">
                  <CloseIcon
                    className={classes.icon}
                    onClick={() => {
                      minimizePlayer();
                      trackEvent("Mini player minimized", {});
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            {/* <hr className={classes.divider}></hr> */}
          </div>
          <div
            onMouseMoveCapture={(e) => {
              if (isDragging) {
                setDisableDragging(true);
              }
            }}
            className={classes.playerContainer}
          >
            {player}
          </div>
        </div>
      </Rnd>
    ),
    [
      handleDragStart,
      handleMouseDown,
      playerSize,
      playerPosition,
      bounds,
      classes.playerOuterContainer,
      classes.dragInitiater,
      classes.playerContainer,
      classes.divider,
      classes.toolbar,
      classes.toolbarTitle,
      classes.volumeControlContainer,
      classes.icon,
      handleDrag,
      handleDragStop,
      handleResizeStop,
      mainStageTitle,
      player,
      minimizePlayer,
      isDragging
    ]
  );

  if (!miniPlayerEnabled) {
    return null;
  }

  if (!showSmallPlayer) return null;

  // if (eventSessionDetails.conferenceVideoType === "JITSI") {
  //   return null;
  // }
  // if (loaded) {

  return miniPlayer;
};
// SmallPlayerContainer.whyDidYouRender = true;
export default SmallPlayerContainer;
