import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { openJoinParticipant } from "../../Redux/dialogs";
import { useDispatch } from "react-redux";
import ParticipantAvatar from "../Misc/ParticipantAvatar";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  participantContainer: ({ hideName }) => ({
    marginRight: !hideName ? theme.spacing(2) : 0,
    margin: hideName ? theme.spacing(0.5, 0) : 0,
    cursor: "pointer",
    width: 46
  }),
  participantDetails: {
    flexGrow: 1,
    textAlign: "center",
    marginTop: 4
  },
  avatar: {
    marginTop: 1,
    marginLeft: "auto",
    marginRight: "auto"
  },
  name: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 46
  }
}));

export default function ({ group, hideName, max = 4 }) {
  const classes = useStyles({ hideName });
  const dispatch = useDispatch();

  const handleAvatarClick = React.useCallback(
    (participant) => (e) => {
      e.stopPropagation();
      dispatch(openJoinParticipant(participant));
    },
    [dispatch]
  );

  const extraAvatars = group.length > max ? group.length - max + 1 : 0;

  return (
    <React.Fragment>
      {group.slice(0, group.length - extraAvatars).map((participant) => {
        if (!participant) return null;
        return (
          // <Tooltip key={participant.id} title={`${participant.firstName} ${participant.lastName}`}>
          <div
            key={participant.id}
            className={classes.participantContainer}
            onClick={handleAvatarClick(participant)}
          >
            {/* {participant.avatarUrl && (
                <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
              )}
              {!participant.avatarUrl && (
                <Avatar className={classes.avatar}>
                  {participant.firstName.charAt(0)}
                  {participant.lastName.charAt(0)}
                </Avatar>
              )} */}
            <ParticipantAvatar participant={participant} />
            {!hideName && (
              <div className={classes.participantDetails}>
                <Typography variant="caption" className={classes.name}>
                  {`${participant.firstName} ${
                    participant.lastName.trim() !== ""
                      ? participant.lastName.charAt(0) + "."
                      : ""
                  }`}
                </Typography>
              </div>
            )}
          </div>
          //</Tooltip>
        );
      })}
      {extraAvatars ? (
        <Avatar
        // className={classes.avatar}
        // style={{
        //   zIndex: 0,
        //   marginLeft,
        // }}
        >
          +{extraAvatars}
        </Avatar>
      ) : null}
    </React.Fragment>
  );
}
