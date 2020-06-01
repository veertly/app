import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import EditProfileForm from "./EditProfileForm";
import { useDispatch, useSelector } from "react-redux";
import { closeEditProfile, isEditProfileOpen } from "../../Redux/dialogs";
import { getSessionId } from "../../Redux/eventSession";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import DialogClose from "../Misc/DialogClose";

const useStyles = makeStyles((theme) => ({
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

export default function (props) {
  const classes = useStyles();
  const [userAuth] = useAuthState(firebase.auth());

  // const { eventSession } = props;
  const open = useSelector(isEditProfileOpen);
  const sessionId = useSelector(getSessionId);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeEditProfile());
  };
  return (
    <div>
      <DialogClose open={open} onClose={handleClose}>
        <div className={classes.content}>
          {sessionId && (
            <EditProfileForm
              userAuth={userAuth}
              sessionId={sessionId}
              profileUpdatedCallback={handleClose}
            />
          )}
        </div>
      </DialogClose>
    </div>
  );
}
