import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { closeFeedback } from "../../Redux/actions";
import { isFeedbackOpen } from "../../Redux/selectors";

const useStyles = makeStyles((theme) => ({
  content: {
    width: "100%",
    background: "url(/loading.gif) center center no-repeat",
    height: 600,
  },
}));

export default function (props) {
  const classes = useStyles();

  const { eventSession, myUser } = props;
  const open = useSelector(isFeedbackOpen);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeFeedback());
  };

  const airtableUrl = "https://airtable.com/embed/shrUsGXvQhbQoo0IW";
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" scroll="body">
      <div className={classes.content}>
        <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js"></script>
        <iframe
          className="airtable-embed airtable-dynamic-height"
          src={`${airtableUrl}?prefill_Name=${encodeURI(
            myUser.firstName + " " + myUser.lastName
          )}&prefill_Email=${encodeURI(myUser.email)}&prefill_UserId=${encodeURI(
            myUser.id
          )}&prefill_EventId=${encodeURI(eventSession.id)}`}
          frameBorder="0"
          // onMouseWheel=""
          width="100%"
          height="2823"
          style={{
            height: "100%",
          }}
          title="registerPadeleeAirtable"
          // onLoad={addCssIframe}
          // id="airtableFrame"
        ></iframe>
      </div>
    </Dialog>
  );
}
