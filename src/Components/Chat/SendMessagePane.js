import React from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import { TextField, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "white",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  message: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 8,
  },
}));

export default (props) => {
  const { onMessageSendClicked } = props;
  const classes = useStyles();
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSendClicked(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <div className={classes.message}>
        <TextField value={message} onChange={(e) => setMessage(e.target.value)} fullWidth></TextField>
      </div>
      <div className={classes.buttons}>
        <IconButton type="submit" aria-label="delete" className={classes.margin} color="primary">
          <SendIcon />
        </IconButton>
      </div>
    </form>
  );
};
