import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { closeEventDetails, isEventDetailsOpen } from "../../Redux/dialogs";
import EventPage from "./EventPage";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    // padding: 48,
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

  const { eventSession } = props;
  const open = useSelector(isEventDetailsOpen);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeEventDetails());
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} scroll={"body"}>
        <div className={classes.content}>
          {eventSession && <EventPage event={eventSession} hideButtons={true} isPreview={true} />}
        </div>
      </Dialog>
    </div>
  );
}
