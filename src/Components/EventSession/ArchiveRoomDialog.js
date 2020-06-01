import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { archiveRoom } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";
import Alert from "@material-ui/lab/Alert";

import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../../Redux/eventSession";
import { Typography } from "@material-ui/core";
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

  let [saving, setSaving] = React.useState(false);

  // const userGroup = useSelector(getUserLiveGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const handleClose = () => {
    setOpen(false);
  };

  const handleArchiveRoom = (e) => {
    e.preventDefault();
    const cb = async () => {
      setSaving(true);

      await archiveRoom(sessionId, room.id, userId, snackbar);

      handleClose();
      setSaving(false);
    };
    cb();
  };
  const hasParticipants = React.useMemo(
    () => room.participants && Object.keys(room.participants).length > 0,
    [room.participants]
  );

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
            {/* Archive room */}
            {room.roomName}
          </Typography>
          {hasParticipants && (
            <Alert severity={"error"} className={classes.alert}>
              Are you sure you want to archive this room? When archiving it,
              existing conversations within this room will end.
            </Alert>
          )}
          {!hasParticipants && (
            <Alert severity={"warning"} className={classes.alert}>
              Are you sure you want to archive this room?
            </Alert>
          )}
          {/* <TextField
            autoFocus
            label="Room Name"
            name="roomName"
            variant="outlined"
            value={roomName}
            fullWidth
            onChange={(e) => setRoomName(e.target.value)}
            required
          /> */}
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleArchiveRoom}
              disabled={
                // roomName.trim() === "" ||
                // roomName.trim() === room.roomName.trim() ||
                saving
              }
            >
              Archive Room
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
