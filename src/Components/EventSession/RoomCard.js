import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Tooltip } from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import RoomIcon from "@material-ui/icons/LocalOffer";

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
  },
  roomName: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    // display: "-webkit-box",
    // "-webkit-box-orient": "vertical",
    // "-webkit-line-clamp": 2,
    display: "flex",
    overflow: "hidden",
  },
}));

export default function (props) {
  const classes = useStyles();

  const { group, participants } = props;

  if (!group.isRoom) {
    return null;
  }
  return (
    <React.Fragment>
      <div className={classes.roomContainer}>
        <Tooltip title={group.roomName}>
          <Typography className={classes.roomName}>
            <RoomIcon style={{ marginRight: 8 }} />
            <span>{group.roomName ? group.roomName.trim().substring(0, 90) : ""}</span>
          </Typography>
        </Tooltip>

        <div className={classes.roomParticipants}>
          <AvatarGroup max={5} spacing="medium">
            {participants.map((participant) => {
              if (participant.avatarUrl) {
                return (
                  <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
                    <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
                  </Tooltip>
                );
              }
              return (
                <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
                  <Avatar className={classes.avatar}>
                    {participant.firstName.charAt(0)}
                    {participant.lastName.charAt(0)}
                  </Avatar>
                </Tooltip>
              );
            })}
            {participants.map((participant) => {
              if (participant.avatarUrl) {
                return (
                  <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
                    <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
                  </Tooltip>
                );
              }
              return (
                <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
                  <Avatar className={classes.avatar}>
                    {participant.firstName.charAt(0)}
                    {participant.lastName.charAt(0)}
                  </Avatar>
                </Tooltip>
              );
            })}
          </AvatarGroup>
        </div>
      </div>
    </React.Fragment>
  );
}
