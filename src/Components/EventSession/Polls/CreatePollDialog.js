import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
// import { createNewRoom } from "../../Modules/eventSessionOperations";
// import { useSnackbar } from "material-ui-snackbar-provider";
// import { v1 as uuidv1 } from "uuid";

// import { useSelector, shallowEqual } from "react-redux";
// import {
//   getSessionId,
//   getUserId,
//   getUserLiveGroup
// } from "../../Redux/eventSession";
// import Alert from "@material-ui/lab/Alert";
// import { isCreateRoomOpen, closeCreateRoom } from "../../Redux/dialogs";
import {
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";
import DialogClose from "../Misc/DialogClose";
const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative"
    // width: theme.breakpoints.values.sm
    // padding: theme.spacing(6),
    // textAlign: "center"
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    paddingTop: theme.spacing(2)
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2)
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4)
  },
  participantContainer: {
    marginBottom: theme.spacing(3)
  },
  alert: {
    marginTop: theme.spacing(2)
  },
  avatarsContainer: {
    padding: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(0.5)
  },
  dialogTitle: { color: theme.palette.primary.main },
  button: { margin: theme.spacing(2) }
}));

// const getPollOptionData = (value) => {
//   const optionId = uuidv1();
//   return {
//     optionId,
//     value
//   };
// };

export const CreatePollDialog = ({ open, setOpen }) => {
  const classes = useStyles();
  // const snackbar = useSnackbar();
  let [title, setTitle] = React.useState("");
  // let [options, setOptions] = React.useState([]);

  // const userGroup = useSelector(getUserLiveGroup, shallowEqual);
  // const sessionId = useSelector(getSessionId);
  // const userId = useSelector(getUserId);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    // createNewRoom(sessionId, roomName, userId, userGroup, snackbar);
    handleClose();
  };

  return (
    <div>
      <DialogClose
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle className={classes.dialogTitle}>
          Create new poll
        </DialogTitle>
        <DialogContent>
          <div className={classes.content}>
            {/* <Typography
            color="primary"
            variant="h4"
            align="center"
            style={{ marginBottom: 16 }}
          >
            Create new room
          </Typography> */}
            <TextField
              autoFocus
              label="Title"
              name="title"
              variant="outlined"
              value={title}
              // style={{ width: "50%" }}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            {/* <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleCreateRoom}
              disabled={roomName.trim() === ""}
            >
              Create
            </Button>
          </div> */}
            {/* <Alert severity="info" className={classes.alert}>
              A room will be created with this name and any attendee will be
              able to join it
            </Alert> */}
            {/* {userGroup && (
            <Alert severity="warning" className={classes.alert}>
              You will leave your current call
            </Alert>
          )} */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            className={classes.button}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </DialogClose>
    </div>
  );
};