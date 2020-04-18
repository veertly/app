import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import EditProfileForm from "./EditProfileForm";
import { useDispatch, useSelector } from "react-redux";
import { closeEditProfile, isEditProfileOpen } from "../../Redux/dialogs";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    padding: 48,
  },
  closeContainer: {
    position: "absolute",
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2),
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4),
  },
}));

export default function (props) {
  const classes = useStyles();

  const { eventSession, user } = props;
  const open = useSelector(isEditProfileOpen);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeEditProfile());
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.content}>
          {eventSession && (
            <EditProfileForm user={user} sessionId={eventSession.id} profileUpdatedCallback={handleClose} />
          )}
        </div>
      </Dialog>
    </div>
  );
}
