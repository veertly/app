import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

import { useSelector, useDispatch } from "react-redux";
import { DialogActions, DialogTitle, DialogContent } from "@material-ui/core";
import {
  isRoomArchivedOpen,
  closeRoomArchived,
  getRoomArchivedEntity
} from "../../../Redux/dialogs";

const useStyles = makeStyles((theme) => ({
  button: { margin: theme.spacing(2) },
  dialogTitle: { color: theme.palette.primary.main }
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
        <DialogTitle className={classes.dialogTitle}>
          {room.roomName}
        </DialogTitle>
        <DialogContent>
          <Alert severity={"warning"} className={classes.alert}>
            The room you were in has been archived
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            className={classes.button}
            color="primary"
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
