import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ReactPlayer from "react-player";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
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

const FacebookPlayer = ({ videoId }) => {
  const classes = useStyles();
  const [loadingPlayer, setLoadingPlayer] = React.useState(true);
  return (
    <div className={classes.reactPlayerContainer}>
      <ReactPlayer
        url={`https://www.facebook.com/facebook/videos/${videoId}`}
        width="100%"
        height="none"
        className={classes.reactPlayer}
        // playing
        onReady={() => setLoadingPlayer(false)}
      />
      {loadingPlayer && (
        <div className={classes.reactPlayer}>
          <CircularProgress color="secondary" />
        </div>
      )}
    </div>
  );
};

export default FacebookPlayer;
