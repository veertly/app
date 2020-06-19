import React, { useState /* , { useState }  */, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { createNewRoom, editRoom } from "../../Modules/eventSessionOperations";
import { useSnackbar } from "material-ui-snackbar-provider";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { convertToRaw } from "draft-js";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getSessionId, getUserId } from "../../Redux/eventSession";
import Alert from "@material-ui/lab/Alert";
import {
  isCreateRoomOpen,
  closeCreateRoom,
  getEditRoomEntity
} from "../../Redux/dialogs";
import {
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Collapse
} from "@material-ui/core";
import DialogClose from "../Misc/DialogClose";
import MUIRichTextEditor from "mui-rte";
import OutlinedDiv from "../Misc/OutlinedDiv";
import Link from "@material-ui/core/Link";

const defaultTheme = createMuiTheme();

Object.assign(defaultTheme, {
  overrides: {
    MUIRichTextEditor: {
      // root: {
      //   backgroundColor: "#ebebeb"
      // },
      // container: {
      //   display: "flex",
      //   flexDirection: "column-reverse"
      // },
      editor: {
        // backgroundColor: "#ebebeb",
        paddingLeft: 8,
        paddingRight: 8,
        // height: "200px",
        maxHeight: "200px",
        overflow: "auto"
      },
      // toolbar: {
      //   borderTop: "1px solid gray",
      //   backgroundColor: "#ebebeb"
      // },
      placeHolder: {
        // backgroundColor: "#ebebeb",
        paddingLeft: 8,
        // width: "inherit",
        position: "relative"
        // top: "20px"
      }
    }
  }
});

const useStyles = makeStyles((theme) => ({
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

export default function () {
  const classes = useStyles();
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const open = useSelector(isCreateRoomOpen);
  const room = useSelector(getEditRoomEntity, shallowEqual);

  let [roomName, setRoomName] = React.useState(room ? room.roomName : "");

  const [roomDescription, setRoomDescription] = useState(
    room && room.roomDescription ? room.roomDescription : null
  );

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    setRoomName(room ? room.roomName : "");
    setRoomDescription(
      room && room.roomDescription ? room.roomDescription : null
    );
    setDescriptionExpanded(
      room && room.roomDescription && room.roomDescription.trim() !== ""
    );
  }, [room]);

  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  const handleClose = () => {
    setRoomName("");
    setRoomDescription(null);
    setDescriptionExpanded(false);
    dispatch(closeCreateRoom());
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    if (room) {
      editRoom(sessionId, room.id, roomName, roomDescription, userId, snackbar);
    } else {
      createNewRoom(sessionId, roomName, roomDescription, userId);
    }
    handleClose();
  };

  const handleDescriptionUpdate = (editorState) => {
    setRoomDescription(
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  const handleAddRemoveDescription = (e) => {
    e.preventDefault();
    if (descriptionExpanded) {
      setRoomDescription(null);
    }
    setDescriptionExpanded(!descriptionExpanded);
  };

  return (
    <div>
      <DialogClose
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <form onSubmit={handleCreateRoom}>
          <DialogTitle className={classes.dialogTitle}>
            {room ? "Edit room" : "Create new room"}
          </DialogTitle>
          <DialogContent>
            <div className={classes.content}>
              <TextField
                autoFocus
                label="Room Name"
                name="roomName"
                variant="outlined"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                fullWidth
              />
              <Collapse in={descriptionExpanded}>
                <Box mt={2}>
                  <OutlinedDiv label="Room description" fullWidth>
                    {/* <Box pb={2}> */}
                    <MuiThemeProvider theme={defaultTheme}>
                      <MUIRichTextEditor
                        style={{ minHeight: 100 }}
                        label="Type optional room description..."
                        controls={[
                          "title",
                          "bold",
                          "italic",
                          "underline",
                          // "strikethrough",
                          "link",
                          "media",
                          "numberList",
                          "bulletList",
                          "quote",
                          // "code",
                          "clear"
                          // "undo",
                          // "redo",
                        ]}
                        onChange={handleDescriptionUpdate}
                        inlineToolbar={true}
                        // maxLength={5000}
                        value={room ? room.roomDescription : null}
                        inlineToolbarControls={[
                          "title",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "link",
                          "media",
                          "numberList",
                          "bulletList",
                          "quote",
                          "code",
                          "clear"
                        ]}
                        // toolbarButtonSize="small"
                      />
                      {/* </Box> */}
                    </MuiThemeProvider>
                  </OutlinedDiv>
                </Box>
              </Collapse>
              <Box mt={1}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleAddRemoveDescription}
                >
                  {descriptionExpanded
                    ? "- Remove room description"
                    : "+ Add room description"}
                </Link>
              </Box>

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
              {!room && (
                <Alert severity="info" className={classes.alert}>
                  A room will be created with this name and any attendee will be
                  able to join it
                </Alert>
              )}
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
              // onClick={handleCreateRoom}
              className={classes.button}
              color="primary"
              variant="contained"
              type="submit"
            >
              {room ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </DialogClose>
    </div>
  );
}
