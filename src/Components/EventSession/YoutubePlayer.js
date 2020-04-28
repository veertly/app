import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import ReactPlayer from 'react-player';

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
    overflow: 'hidden',
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

const YoutubePlayer = ({ videoId, volume=50 }) => {
  const classes = useStyles();

  // return (
  //   <iframe
  //   className={classes.videoContainer}
  //   src={`https://www.youtube.com/embed/${videoId}?autoplay=1&fs=0&modestbranding=0`}
  //   frameBorder="0"
  //   allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  //   allowFullScreen
  //   title="livestream"
  // ></iframe>
  // )
  return (
    <div className={classes.reactPlayerContainer}>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        width="100%"
        height="100%"
        className={classes.reactPlayer}
        playing
        volume={volume}
        controls
      />
    </div>
  );


}

export default YoutubePlayer;
