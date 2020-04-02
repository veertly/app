import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "material-ui-snackbar-provider";
import EditProfileForm from "./EditProfileForm";

const useStyles = makeStyles(theme => ({
  content: {
    position: "relative",
    padding: 48
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(2)
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
  }
}));

function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function(props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, eventSession, user } = props;

  const handleClose = () => {
    setOpen(false);
  };

  // const handleJoinConversation = e => {
  //   e.preventDefault();
  //   joinConversation(eventSession, user.uid, groupId, snackbar);
  //   setOpen(false);
  // };
  // let isMyGroup = group.find(participant => participant.id === user.uid);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        // PaperComponent={PaperComponent}
        // aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          <EditProfileForm user={user} />
          {/* {group.map(participant => {
            return <ParticipantCard key={participant.id} participant={participant} />;
          })}
          {!isMyGroup && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={handleJoinConversation}
                >
                  Join Conversation
                </Button>
              </div>
              <Typography className={classes.hintText} variant="caption">
                You will join the video conferencing call of the selected group.
              </Typography>
            </React.Fragment>
          )}
          {isMyGroup && <div className={classes.emptySpaceBottom}></div>} */}
        </div>
      </Dialog>
    </div>
  );
}
