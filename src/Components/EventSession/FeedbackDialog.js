import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { closeFeedback, isFeedbackOpen } from "../../Redux/dialogs";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getUser, getSessionId, getUserId } from "../../Redux/eventSession";

const useStyles = makeStyles((theme) => ({
  content: {
    width: "100%",
    background: "url(/loading.gif) center center no-repeat",
    height: 600,
  },
}));

export default function (props) {
  const classes = useStyles();

  const open = useSelector(isFeedbackOpen);

  const dispatch = useDispatch();

  const user = useSelector(getUser, shallowEqual);
  const userId = useSelector(getUserId);
  const sessionId = useSelector(getSessionId);

  const { firstName, lastName, email } = React.useMemo(
    () =>
      user
        ? { firstName: user.firstName, lastName: user.lastName, email: user.email }
        : { firstName: "", lastName: "", email: "" },
    [user]
  );
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
          src={`${airtableUrl}?prefill_Name=${encodeURI(firstName + " " + lastName)}&prefill_Email=${encodeURI(
            email
          )}&prefill_UserId=${encodeURI(userId)}&prefill_EventId=${encodeURI(sessionId)}`}
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
