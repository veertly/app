import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import RoomIcon from "@material-ui/icons/LocalOffer";
import { useDispatch, useSelector } from "react-redux";
import { openJoinRoom } from "../../Redux/dialogs";
import ParticipantAvatar from "../Misc/ParticipantAvatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton } from "@material-ui/core";
import { getUserId, getEventSessionDetails } from "../../Redux/eventSession";
import { Typography } from "@material-ui/core";
import EditRoomDialog from "./EditRoomDialog";
import ArchiveRoomDialog from "./ArchiveRoomDialog";

const useStyles = makeStyles((theme) => ({
  participantContainer: {
    marginRight: theme.spacing(2),
    cursor: "pointer"
  },
  participantDetails: {
    flexGrow: 1,
    textAlign: "center",
    marginTop: 4
  },
  topicsInterested: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 185
  },
  avatar: {
    marginTop: 1,
    marginLeft: "auto",
    marginRight: "auto"
  },
  roomContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      cursor: "pointer",
      borderRadius: 0
    },
    cursor: "pointer"
  },
  roomParticipants: {
    display: "flex",
    marginTop: 4,
    marginBottom: 4
  },
  roomName: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    display: "flex",
    overflow: "hidden"
  },
  roomMenu: {
    position: "absolute",
    right: 0,
    bottom: 12
  }
}));

export default function (props) {
  const classes = useStyles();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const [renameRoomOpen, setRenameRoomOpen] = React.useState(false);
  const [archiveRoomOpen, setArchiveRoomOpen] = React.useState(false);
  const [mouseHover, setMouseHover] = React.useState(false);

  const { room } = props;

  const dispatch = useDispatch();
  const myUserId = useSelector(getUserId);
  const eventDetails = useSelector(getEventSessionDetails);

  const canManageRoom = React.useMemo(
    () => room.roomOwner === myUserId || eventDetails.owner === myUserId,
    [room.roomOwner, eventDetails.owner, myUserId]
  );

  const handleJoinRoom = () => {
    dispatch(openJoinRoom(room));
  };

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

  const handleRenameClick = (e) => {
    e.stopPropagation();
    setRenameRoomOpen(true);
    closeMenu();
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation();
    setArchiveRoomOpen(true);
    closeMenu();
  };

  if (!room || !room.isRoom) {
    return null;
  }

  return (
    <React.Fragment>
      <div
        className={classes.roomContainer}
        onClick={handleJoinRoom}
        onMouseEnter={() => {
          setMouseHover(true);
        }}
        onMouseLeave={() => {
          setMouseHover(false);
        }}
      >
        <Typography className={classes.roomName}>
          <RoomIcon style={{ marginRight: 8 }} />
          {/* <img
            src="/static/Room_icon_02.svg"
            style={{ marginRight: 8, width: 16 }}
          /> */}
          <span>
            {room.roomName ? room.roomName.trim().substring(0, 90) : ""}
          </span>
        </Typography>

        <div className={classes.roomParticipants}>
          {room.participants.length > 0 && (
            <>
              <AvatarGroup max={5} spacing="medium">
                {room.participants.map((participant) => {
                  if (!participant) return null;
                  return (
                    <ParticipantAvatar
                      key={participant.id}
                      participant={participant}
                      style={{ marginLeft: 2, marginRight: 2 }}
                    />
                  );
                })}
              </AvatarGroup>
            </>
          )}
          {room.participants.length === 0 && (
            <Typography color="textSecondary">This room is empty</Typography>
          )}
        </div>
        {mouseHover && canManageRoom && (
          <div className={classes.roomMenu}>
            <IconButton
              color="primary"
              className={classes.leaveCallButton}
              aria-label="Call menu"
              onClick={handleMenu}
            >
              <MoreVertIcon />
            </IconButton>
            {/* </Tooltip> */}
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchorEl}
              // anchorOrigin={{
              //   vertical: "center",
              //   horizontal: "right"
              // }}
              // transformOrigin={{
              //   vertical: "bottom",
              //   horizontal: "center"
              // }}
              keepMounted
              open={openMenu}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
              <MenuItem onClick={handleArchiveClick}>Archive</MenuItem>
            </Menu>
          </div>
        )}
      </div>
      <EditRoomDialog
        open={renameRoomOpen}
        setOpen={setRenameRoomOpen}
        room={room}
      />
      <ArchiveRoomDialog
        open={archiveRoomOpen}
        setOpen={setArchiveRoomOpen}
        room={room}
      />
    </React.Fragment>
  );
}
