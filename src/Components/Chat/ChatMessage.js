import React from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import moment from "moment";
import UserAvatar from "../Misc/UserAvatar";
import EllipsisLoader from "../Misc/EllipsisLoader";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5, 1.5),
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      // cursor: "pointer",
      borderRadius: 0,
    },
    // overflow: "auto",
    // flexWrap: "inherit",
  },
  messageContainer: {
    flexGrow: 1,
    width: "calc(100% - 56px)",
  },
  avatar: {
    margin: theme.spacing(0, 1, 0, 0),
  },
}));

export default (props) => {
  let { message /* , user */, users } = props;

  const classes = useStyles();
  // const isMyMessage = React.useMemo(() => message.userId === user.uid, [user, message]);

  const messageUser = React.useMemo(() => users[message.userId], [users, message.userId]);
  const sentDate = React.useMemo(() => (message.sentDate ? moment(message.sentDate.toDate()) : null), [
    message.sentDate,
  ]);

  if (messageUser === null) {
    console.error("Couldn't find the user for this message which should never happen...");
    return null;
  }
  const { firstName, lastName } = messageUser;
  return (
    <Grid container justify="flex-start" className={classes.root}>
      <Grid item className={classes.avatar}>
        <UserAvatar user={messageUser} size="small" />
      </Grid>
      <Grid item className={classes.messageContainer}>
        <Typography className={classes.userName}>{`${firstName} ${lastName}`}</Typography>
        <Typography className={classes.messageText} color="textSecondary">
          {message.message}
        </Typography>
        <Typography variant="caption" className={classes.sentDate}>
          {sentDate && sentDate.fromNow()}
          {!sentDate && <EllipsisLoader />}
        </Typography>
      </Grid>
    </Grid>
  );
};
