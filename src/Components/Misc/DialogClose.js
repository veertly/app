import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  content: {
    // position: "relative"
  },
  closeContainer: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    // backgroundColor: "red",
    fontSize: "1.6rem",
    color: theme.palette.primary.light,
    cursor: "pointer",
    zIndex: 1000
  }
}));

const DialogClose = ({ open, onClose, children, ...rest }) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} {...rest}>
      <IconButton onClick={onClose} className={classes.closeContainer}>
        <CloseIcon fontSize="inherit" />
      </IconButton>

      {children}
    </Dialog>
  );
};

export default DialogClose;
