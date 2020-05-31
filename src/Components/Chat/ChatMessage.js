import React from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import * as moment from "moment";
import UserAvatar from "../Misc/UserAvatar";
import EllipsisLoader from "../Misc/EllipsisLoader";
import { useDispatch } from "react-redux";
import { openJoinParticipant } from "../../Redux/dialogs";
import Linkify from "react-linkify";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1.5, 1.5),
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      borderRadius: 0
    }
  },
  messageContainer: {
    flexGrow: 1,
    width: "calc(100% - 56px)"
  },
  avatar: {
    margin: theme.spacing(0, 1, 0, 0)
  },
  userName: {
    padding: 0,
    "text-transform": "none",
    fontSize: "1rem",
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

export default (props) => {
  let { message /* , user */, users } = props;

  const classes = useStyles();
  // const isMyMessage = React.useMemo(() => message.userId === user.id, [user, message]);
  const dispatch = useDispatch();

  const messageUser = React.useMemo(() => users[message.userId], [
    users,
    message.userId
  ]);
  const sentDate = React.useMemo(
    () => (message.sentDate ? moment(message.sentDate.toDate()) : null),
    [message.sentDate]
  );

  if (!messageUser) {
    console.error(
      "Couldn't find the user for this message which should never happen..."
    );
    return null;
  }
  const { firstName, lastName } = messageUser;

  const handleAvatarClick = React.useCallback(
    () => dispatch(openJoinParticipant(messageUser)),
    [messageUser, dispatch]
  );

  return (
    <Grid container justify="flex-start" className={classes.root}>
      <Grid item className={classes.avatar}>
        <UserAvatar
          user={messageUser}
          size="small"
          onClick={handleAvatarClick}
        />
      </Grid>
      <Grid item className={classes.messageContainer}>
        <Typography
          className={classes.userName}
          onClick={handleAvatarClick}
        >{`${firstName} ${lastName}`}</Typography>
        <Typography className={classes.messageText} color="textSecondary">
          <Linkify componentDecorator={componentDecorator}>
            {message.message}
          </Linkify>
        </Typography>
        <Typography variant="caption" className={classes.sentDate}>
          {sentDate && sentDate.fromNow()}
          {!sentDate && <EllipsisLoader />}
        </Typography>
      </Grid>
    </Grid>
  );
};
