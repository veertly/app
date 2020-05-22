import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";


const useStyles = makeStyles(() => ({
  wrapper: ({ top, bottom, left, right }) => ({
    paddingTop: top,
    paddingRight: right,
    paddingLeft: left,
    paddingBottom: bottom,
  }),
}));

const MarginProvider = ({ left = 0, right = 0, top = 0, bottom = 0, className, ...props }) => {
  const classes = useStyles({ left, right, top, bottom })
  return (
    <div
      className={clsx(classes.wrapper, className)}
      {...props}
    />
  )
}

export default MarginProvider;
