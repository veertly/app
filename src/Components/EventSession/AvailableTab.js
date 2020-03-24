import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import LinkedinIcon from "../../Assets/Icons/Linkedin";
import Button from "@material-ui/core/Button";
import JoinParticipantDialog from "./JoinParticipantDialog";
const useStyles = makeStyles(theme => ({
  root: {},
  participantContainer: {
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      cursor: "pointer",
      borderRadius: 0
    },
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex"
  },
  participantDetails: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    position: "relative"
  },
  topicsInterested: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 185
  },
  avatar: {
    marginTop: 1
  },
  linkedin: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 16,
    color: theme.palette.text.secondary
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center"
  },
  button: {
    margin: theme.spacing(1)
  },
  title: {
    marginTop: theme.spacing(1),
    display: "block"
  }
}));
// rgba(28, 71, 98, 0.08)

export default function(props) {
  const classes = useStyles();
  const [joinDialog, setJoinDialog] = React.useState(false);
  const [selectedParticipant, setSelectedParticipant] = React.useState(null);
  const { users, eventSession, user, onConferenceRoom } = props;

  // const [participantsList , setParticipantsList
  // console.log({ listParticipantsAvailableTab: eventSession.participantsJoined });

  const participantsAvailable = Object.keys(eventSession.participantsJoined).filter(userId => {
    let participant = users[userId];
    let sessionParticipant = eventSession.participantsJoined[userId];
    // console.log({ sessionParticipant });
    if (!participant) {
      // console.log(users);
      console.error("Couldn't find participant for user: '" + userId + "'");
      return false;
    }
    if (
      (onConferenceRoom && sessionParticipant.inNetworkingRoom) ||
      (!onConferenceRoom && !sessionParticipant.inNetworkingRoom)
    ) {
      return false;
    }
    if (!sessionParticipant.isOnline || sessionParticipant.groupId) {
      return false;
    }
    return true;
  });
  // console.log({ participantsAvailable });
  const feelingLucky = () => {
    let index = Math.floor(Math.random() * participantsAvailable.length);
    let userId = participantsAvailable[index];
    let participant = users[userId];
    // console.log(participant);
    setSelectedParticipant(participant);
    setJoinDialog(true);
  };

  if (!eventSession) {
    return null;
  }
  return (
    <div className={classes.root}>
      <JoinParticipantDialog
        open={joinDialog}
        setOpen={setJoinDialog}
        participant={selectedParticipant}
        eventSession={eventSession}
        user={user}
        onConferenceRoom={onConferenceRoom}
      />
      {!onConferenceRoom && (
        <div className={classes.buttonContainer}>
          <Button variant="outlined" color="primary" size="small" className={classes.button} onClick={feelingLucky}>
            I'm feeling lucky
          </Button>
        </div>
      )}
      {onConferenceRoom && (
        <Typography variant="overline" className={classes.title} align="center">
          All attendees
        </Typography>
      )}
      {participantsAvailable.map((userId, index) => {
        let participant = users[userId];
        return (
          <div
            className={classes.participantContainer}
            onClick={() => {
              setSelectedParticipant(participant);
              setJoinDialog(true);
            }}
            key={index}
          >
            {participant.avatarUrl && (
              <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
            )}
            {!participant.avatarUrl && (
              <Avatar className={classes.avatar}>
                {participant.firstName.charAt(0)}
                {participant.lastName.charAt(0)}
              </Avatar>
            )}
            <div className={classes.participantDetails}>
              <Typography variant="subtitle1">{`${participant.firstName} ${participant.lastName}`}</Typography>
              <Typography variant="caption" className={classes.topicsInterested}>
                {`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
              </Typography>
              {/* <img src={LinkedinIcon} alt="LinkedIn profile" className={classes.linkedIn} /> */}
              {participant.linkedinUrl && <LinkedinIcon className={classes.linkedin} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
