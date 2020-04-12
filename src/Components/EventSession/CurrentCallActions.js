import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import GroupAvatars from "./GroupAvatars";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { IconButton, Tooltip } from "@material-ui/core";
import LeaveCallIcon from "../../Assets/Icons/LeaveCall";
import { leaveCall } from "../../Modules/eventSessionOperations";
import LeaveCallDialog from "./LeaveCallDialog";

momentDurationFormatSetup(moment);

const useStyles = makeStyles((theme) => ({
  groupContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(0, 1),
    position: "relative",
  },
  avatarsContainer: {
    display: "flex",
  },
  title: {
    margin: theme.spacing(0, 0, 1, 0),
    display: "block",
  },
  leaveCallContainer: {
    position: "absolute",
    right: -9,
    top: 24,
  },
  leaveCallButton: {
    // color: red[500]
  },
}));

export default function (props) {
  const classes = useStyles();

  const { eventSession, currentGroup, users, user } = props;
  const userId = user.uid;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [leaveCallOpen, setLeaveCallOpen] = useState(false);

  if (!currentGroup) {
    return null;
  }

  useEffect(() => {
    var timerID = setInterval(() => {
      const currentTimestamp = new Date().getTime();
      const joinedTimestamp = currentGroup.participants[userId].joinedTimestamp.toDate().getTime();
      setElapsedTime(currentTimestamp - joinedTimestamp);
    }, 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  useEffect(() => {
    // calculate list participants online
    const participants = Object.keys(currentGroup.participants).reduce((result, participantId) => {
      let participant = users[participantId];
      let participantSession = currentGroup.participants[participantId];

      console.log({ participantSession, participant });

      if (participantSession.leftTimestamp === null) {
        result.push(participant);
      }

      console.log({ result });
      return result;
    }, []);

    console.log({ participants });
    setParticipants(participants);
  }, [currentGroup, users]);

  const showElapsedTime = () => {
    let elapsedMoment = moment.duration(elapsedTime, "milliseconds");
    return elapsedMoment.format();
  };

  const handleLeaveCall = () => {
    leaveCall(eventSession, userId);
  };
  return (
    <div className={classes.groupContainer}>
      <LeaveCallDialog open={leaveCallOpen} handleLeaveCall={handleLeaveCall} setOpen={setLeaveCallOpen} />
      <Typography variant="caption" className={classes.title}>
        CURRENT CONVERSATION ({showElapsedTime()})
      </Typography>
      <div className={classes.avatarsContainer}>
        <GroupAvatars group={participants} />
      </div>
      <div className={classes.leaveCallContainer}>
        <Tooltip title="Leave conversation" placement="right">
          <IconButton
            color="primary"
            className={classes.leaveCallButton}
            aria-label="Leave conversation"
            onClick={() => setLeaveCallOpen(true)}
          >
            <LeaveCallIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
