import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import {
  isRoomArchivedOpen,
  closeRoomArchived,
  getRoomArchivedEntity
} from "../../Redux/dialogs";
const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(4)
    // textAlign: "center"
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    paddingTop: theme.spacing(2)
  }
}));

export default function (props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector(isRoomArchivedOpen);
  const room = useSelector(getRoomArchivedEntity);

  const handleClose = () => {
    dispatch(closeRoomArchived());
  };
  if (!room) {
    return null;
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          <Typography
            color="primary"
            variant="h4"
            align="left"
            style={{ marginBottom: 24 }}
          >
            {room.roomName}
          </Typography>

          <Alert severity={"warning"} className={classes.alert}>
            The room you were in has been archived
          </Alert>

          <div className={classes.buttonContainer}>
            <Button
              // variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handleClose}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
