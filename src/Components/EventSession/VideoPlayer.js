import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ReactPlayer from "react-player";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
  videoContainer: {
    width: "100%",
    height: "100%",
  },
  reactPlayerContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    // paddingTop: "56.25%" /* Player ratio: 100 / (1280 / 720) */,
    backgroundColor: "black",
    overflow: "hidden",
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

const VideoPlayer = ({ url, showLoader, volume = 50 }) => {
  const classes = useStyles();
  const [loadingPlayer, setLoadingPlayer] = React.useState(showLoader);
  const handlePlayerReady = React.useCallback(
    () => setLoadingPlayer(false),
    []
  );
  return (
    <div className={classes.reactPlayerContainer}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        className={classes.reactPlayer}
        playing
        volume={volume}
        onReady={handlePlayerReady}
        controls
      />
      {loadingPlayer && (
        <div className={classes.reactPlayer}>
          <CircularProgress color="secondary" />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
