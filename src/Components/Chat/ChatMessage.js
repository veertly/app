import React from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box
} from "@material-ui/core";
import * as moment from "moment";
import UserAvatar from "../Misc/UserAvatar";
import EllipsisLoader from "../Misc/EllipsisLoader";
import { useDispatch } from "react-redux";
import { openJoinParticipant } from "../../Redux/dialogs";
import Linkify from "react-linkify";
import MenuIcon from "@material-ui/icons/MoreHoriz";
import ChatMessagesContext from "../../Contexts/ChatMessagesContext";
import ParticipantRole from "../Misc/ParticipantRole";

const useStyles = makeStyles((theme) => ({
  root: ({ previewOnly }) => ({
    padding: theme.spacing(1.5, 1.5),
    "&:hover": previewOnly
      ? {}
      : {
          backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
          borderRadius: 0
        },
    position: "relative"
  }),
  messageContainer: {
    flexGrow: 1,
    width: "calc(100% - 56px)"
  },
  messageText: {
    wordWrap: "break-word"
    // fontSize: "1rem",
    // color: "rgba(0, 0, 0, 0.87)"
  },
  avatar: {
    margin: theme.spacing(0, 1, 0, 0)
  },
  userName: {
    padding: 0,
    "text-transform": "none",
    fontSize: "1rem",
    fontWeight: "500",
    "&:hover": {
      cursor: "pointer"
    }
  },
  menuContainer: {
    position: "absolute",
    right: 0,
    top: 0
  }
}));

const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

export default ({ message, users, previewOnly = false, isOwner, userId }) => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const [mouseHover, setMouseHover] = React.useState(false);

  const classes = useStyles({ previewOnly });

  const isMyMessage = message.userId === userId;

  const canArchive = isOwner || isMyMessage;

  const dispatch = useDispatch();

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuClose = (e) => {
    e.stopPropagation();
    closeMenu(null);
  };

  const handleMenu = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const messageUser = React.useMemo(() => users[message.userId], [
    users,
    message.userId
  ]);
  const sentDate = React.useMemo(
    () => (message.sentDate ? moment(message.sentDate.toDate()) : null),
    [message.sentDate]
  );

  const { setChatArchiveDialogMessage } = React.useContext(ChatMessagesContext);

  if (!messageUser) {
    console.error(
      "Couldn't find the user for this message which should never happen..."
    );
    return null;
  }
  const { firstName, lastName, roles } = messageUser;

  const handleAvatarClick = React.useCallback(
    () => dispatch(openJoinParticipant(messageUser)),
    [messageUser, dispatch]
  );

  const handleArchiveClick = React.useCallback(() => {
    setChatArchiveDialogMessage(message);
    closeMenu();
  }, [setChatArchiveDialogMessage, message]);

  return (
    <Grid
      container
      justify="flex-start"
      className={classes.root}
      onMouseEnter={() => {
        setMouseHover(true);
      }}
      onMouseLeave={() => {
        setMouseHover(false);
      }}
    >
      <Grid item className={classes.avatar}>
        <UserAvatar
          user={messageUser}
          size="small"
          onClick={handleAvatarClick}
        />
      </Grid>
      <Grid item className={classes.messageContainer}>
        <Box display="flex">
          <Typography
            color="textSecondary"
            className={classes.userName}
            onClick={handleAvatarClick}
          >
            {`${firstName} ${lastName}`}
          </Typography>{" "}
          <Box ml={2}>
            <ParticipantRole roles={roles} />
          </Box>
        </Box>
        <Typography className={classes.messageText}>
          <Linkify componentDecorator={componentDecorator}>
            {message.message}
          </Linkify>
        </Typography>
        <Typography
          variant="caption"
          className={classes.sentDate}
          color="textSecondary"
        >
          {sentDate && sentDate.fromNow()}
          {!sentDate && <EllipsisLoader />}
        </Typography>
      </Grid>
      {mouseHover && canArchive && !previewOnly && (
        <div className={classes.menuContainer}>
          <IconButton
            color="primary"
            className={classes.menuButton}
            aria-label="Message menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorEl}
            keepMounted
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleArchiveClick}>Archive</MenuItem>
          </Menu>
        </div>
      )}
    </Grid>
  );
};
