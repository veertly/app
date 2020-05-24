import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { editRoom } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";

import { useSelector } from "react-redux";
import { getSessionId } from "../../Redux/eventSession";
import { Typography, TextField } from "@material-ui/core";
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
  const snackbar = useSnackbar();
  const { room, open, setOpen } = props;

  let [roomName, setRoomName] = React.useState(room.roomName);
  let [saving, setSaving] = React.useState(false);

  // const userGroup = useSelector(getUserLiveGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  // const userId = useSelector(getUserId);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditRoom = (e) => {
    e.preventDefault();
    const cb = async () => {
      setSaving(true);

      editRoom(sessionId, room.id, roomName, snackbar);

      handleClose();
      setSaving(false);
    };
    cb();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          {/* <div style={{ marginBottom: isMyGroup ? -16 : 8 }}> */}
          <Typography
            color="primary"
            variant="h4"
            align="left"
            style={{ marginBottom: 24 }}
          >
            Edit room
          </Typography>
          <TextField
            autoFocus
            label="Room Name"
            name="roomName"
            variant="outlined"
            value={roomName}
            fullWidth
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleEditRoom}
              disabled={
                roomName.trim() === "" ||
                roomName.trim() === room.roomName.trim() ||
                saving
              }
            >
              Save
            </Button>
          </div>
        </div>
        {/* </div> */}
      </Dialog>
    </div>
  );
}
