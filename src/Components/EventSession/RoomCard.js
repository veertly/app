import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import RoomIcon from "@material-ui/icons/LocalOffer";
import { useDispatch } from "react-redux";
import { openJoinRoom } from "../../Redux/dialogs";
import ParticipantAvatar from "../Misc/ParticipantAvatar";

const useStyles = makeStyles((theme) => ({
  participantContainer: {
    marginRight: theme.spacing(2),
    cursor: "pointer",
  },
  participantDetails: {
    flexGrow: 1,
    textAlign: "center",
    marginTop: 4,
  },
  topicsInterested: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 185,
  },
  avatar: {
    marginTop: 1,
    marginLeft: "auto",
    marginRight: "auto",
  },
  roomContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      cursor: "pointer",
      borderRadius: 0,
    },
    cursor: "pointer",
  },
  roomParticipants: {
    display: "flex",
    marginTop: 4,
    marginBottom: 4,
  },
  roomName: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    display: "flex",
    overflow: "hidden",
  },
}));

export default function (props) {
  const classes = useStyles();

  const { room } = props;
  const dispatch = useDispatch();

  const handleJoinRoom = React.useCallback(() => dispatch(openJoinRoom(room)), [
    dispatch,
    room,
  ]);

  if (!room || !room.isRoom) {
    return null;
  }

  return (
    <React.Fragment>
      <div className={classes.roomContainer} onClick={handleJoinRoom}>
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
              <AvatarGroup max={4} spacing="medium">
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
      </div>
    </React.Fragment>
  );
}
