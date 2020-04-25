import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  videoContainer: {
    width: "100%",
    height: "100%",
  },
}));

const YoutubePlayer = ({ videoId }) => {
  const classes = useStyles();

  return (
    <iframe
    className={classes.videoContainer}
    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&fs=0&modestbranding=0`}
    frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    title="livestream"
  ></iframe>
  )
}

export default YoutubePlayer;
