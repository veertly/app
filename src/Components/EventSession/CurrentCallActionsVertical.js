import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GroupAvatars from "./GroupAvatars";
import * as moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

import { useSelector, shallowEqual } from "react-redux";
import {
  getUsers,
  getUserGroup,
  getUserLiveGroup
} from "../../Redux/eventSession";
momentDurationFormatSetup(moment);

const useStyles = makeStyles((theme) => ({
  groupContainer: {
    // margin: theme.spacing(0, 1),
    padding: theme.spacing(1),
    position: "relative",
    backgroundColor: "rgba(244,246,248, 0.4)", // theme.palette.background.default,
    borderRadius: theme.spacing(0, 2, 2, 0)
  },
  avatarsContainer: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    margin: theme.spacing(0, 0, 1, 0),
    display: "block"
  },
  leaveCallContainer: {
    position: "absolute",
    right: -9,
    top: 24
  },
  leaveCallButton: {
    // color: red[500]
  }
}));

const CurrentCallActionsVertical = function (props) {
  const classes = useStyles();

  const [participants, setParticipants] = useState([]);

  const users = useSelector(getUsers, shallowEqual);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const liveGroup = useSelector(getUserLiveGroup, shallowEqual);

  useEffect(() => {
    // calculate list participants online
    if (liveGroup) {
      const participants = Object.keys(liveGroup.participants).reduce(
        (result, participantId) => {
          let participant = users[participantId];
          let participantSession = userGroup.participants[participantId];

          // console.log({ participantSession, participant });

          if (participant && participantSession.leftTimestamp === null) {
            result.push(participant);
          }
          // console.log({ result });
          return result;
        },
        []
      );

      // console.log({ participants });
      setParticipants(participants);
    } else {
      setParticipants([]);
    }
  }, [liveGroup, users, userGroup.participants]);

  if (!userGroup) {
    return null;
  }

  return (
    <div className={classes.groupContainer}>
      <div className={classes.avatarsContainer}>
        <GroupAvatars group={participants} hideName max={6} />
        {/* {!isRoom && <GroupAvatars group={participants} hideName />}
        {isRoom && (
          <>
            <AvatarGroup
              max={6}
              spacing={0}
              className={classes.avatarsContainer}
              // style={{ paddingLeft: 4, paddingRight: 4 }}
            >
              {participants.map((participant) => {
                if (!participant) return null;
                return (
                  <ParticipantAvatar
                    key={participant.id}
                    participant={participant}
                    style={{ marginTop: 2, marginBottom: 2 }}
                  />
                );
              })}
            </AvatarGroup>
          </>
        )} */}
      </div>
    </div>
  );
};

export default CurrentCallActionsVertical;
