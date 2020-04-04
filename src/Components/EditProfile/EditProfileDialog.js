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

// function PaperComponent(props) {
//   return (
//     <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper {...props} />
//     </Draggable>
//   );
// }

export default function(props) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  const { open, setOpen, eventSession, user } = props;

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        // PaperComponent={PaperComponent}
        // aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          {eventSession && (
            <EditProfileForm user={user} sessionId={eventSession.id} profileUpdatedCallback={handleClose} />
          )}
        </div>
      </Dialog>
    </div>
  );
}