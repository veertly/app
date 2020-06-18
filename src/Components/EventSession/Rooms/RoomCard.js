import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import RoomIcon from "@material-ui/icons/LocalOffer";
import { useDispatch, useSelector } from "react-redux";
import {
  openJoinRoom,
  openRoomReorder,
  openEditRoom
} from "../../../Redux/dialogs";
import ParticipantAvatar from "../../Misc/ParticipantAvatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton } from "@material-ui/core";
import {
  getUserId,
  getEventSessionDetails,
  isEventOwner
} from "../../../Redux/eventSession";
import { Typography } from "@material-ui/core";
import ArchiveRoomDialog from "../ArchiveRoomDialog";

const useStyles = makeStyles((theme) => ({
  participantContainer: ({ previewOnly }) => ({
    marginRight: theme.spacing(2),
    cursor: previewOnly ? null : "pointer"
  }),
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
  roomContainer: ({ previewOnly }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(previewOnly ? 0 : 1),
    position: "relative",
    "&:hover": previewOnly
      ? {}
      : {
          backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
          cursor: "pointer",
          borderRadius: 0
        },
    cursor: previewOnly ? null : "pointer"
  }),
  roomParticipants: {
    display: "flex",
    marginTop: 4,
    marginBottom: 4
  },
  roomName: ({ isMyRoom }) => ({
    color: isMyRoom
      ? theme.palette.secondary.main
      : theme.palette.primary.light,

    marginBottom: theme.spacing(1),
    display: "flex",
    overflow: "hidden"
  }),
  roomMenu: {
    position: "absolute",
    right: 0,
    bottom: 12
  },
  roomIcon: ({ isMyRoom }) => ({
    color: isMyRoom ? theme.palette.secondary.main : theme.palette.primary.light
    // color: theme.palette.primary.light
  })
}));

export default function ({ room, previewOnly = false }) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const [archiveRoomOpen, setArchiveRoomOpen] = React.useState(false);
  const [mouseHover, setMouseHover] = React.useState(false);

  const dispatch = useDispatch();
  const myUserId = useSelector(getUserId);
  const eventDetails = useSelector(getEventSessionDetails);

  const isOwner = useSelector(isEventOwner);

  const canManageRoom = React.useMemo(
    () => room.roomOwner === myUserId || eventDetails.owner === myUserId,
    [room.roomOwner, eventDetails.owner, myUserId]
  );

  const isMyRoom = React.useMemo(
    () => room.participants.findIndex((p) => p.id === myUserId) !== -1,
    [myUserId, room.participants]
  );

  // console.log({ name: room.roomName, isMyRoom });
  const classes = useStyles({ isMyRoom, previewOnly });

  const handleJoinRoom = () => {
    if (!previewOnly) {
      dispatch(openJoinRoom(room));
    }
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
    if (!previewOnly) {
      setMenuAnchorEl(e.currentTarget);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    dispatch(openEditRoom(room));
    closeMenu();
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation();
    setArchiveRoomOpen(true);
    closeMenu();
  };

  const handleReorderClick = (e) => {
    e.stopPropagation();
    dispatch(openRoomReorder());
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
          if (!previewOnly) {
            setMouseHover(true);
          }
        }}
        onMouseLeave={() => {
          if (!previewOnly) {
            setMouseHover(false);
          }
        }}
      >
        <Typography className={classes.roomName}>
          <RoomIcon style={{ marginRight: 8 }} className={classes.roomIcon} />
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
        {!previewOnly && mouseHover && canManageRoom && (
          <div className={classes.roomMenu}>
            <IconButton
              color="primary"
              className={classes.leaveCallButton}
              aria-label="Call menu"
              onClick={handleMenu}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchorEl}
              keepMounted
              open={openMenu}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem onClick={handleArchiveClick}>Archive</MenuItem>
              {isOwner && (
                <MenuItem onClick={handleReorderClick}>Reorder</MenuItem>
              )}
            </Menu>
          </div>
        )}
      </div>
      {/* <CreateRoomDialog
        open={renameRoomOpen}
        setOpen={setRenameRoomOpen}
        room={room}
      /> */}
      <ArchiveRoomDialog
        open={archiveRoomOpen}
        setOpen={setArchiveRoomOpen}
        room={room}
      />
    </React.Fragment>
  );
}
