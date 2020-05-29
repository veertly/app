import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import GroupAvatars from "./GroupAvatars";
import * as moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { IconButton } from "@material-ui/core";
import { leaveCall } from "../../Modules/eventSessionOperations";
import LeaveCallDialog from "./LeaveCallDialog";

import { useSelector, shallowEqual } from "react-redux";
import {
  getSessionId,
  getUsers,
  getUserGroup,
  getUserId,
  getUserLiveGroup
} from "../../Redux/eventSession";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import ParticipantAvatar from "../Misc/ParticipantAvatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";

momentDurationFormatSetup(moment);

const useStyles = makeStyles((theme) => ({
  groupContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(0, 1),
    position: "relative"
  },
  avatarsContainer: {
    display: "flex"
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

const CurrentCallActions = function (props) {
  const classes = useStyles();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [leaveCallOpen, setLeaveCallOpen] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const users = useSelector(getUsers, shallowEqual);
  const userId = useSelector(getUserId);
  const userGroup = useSelector(getUserGroup, shallowEqual);
  const sessionId = useSelector(getSessionId);
  const liveGroup = useSelector(getUserLiveGroup, shallowEqual);

  useEffect(() => {
    var timerID = setInterval(() => {
      const currentTimestamp = new Date().getTime();
      const joinedTimestamp =
        userGroup.participants[userId] &&
        userGroup.participants[userId].joinedTimestamp.toDate().getTime();
      setElapsedTime(currentTimestamp - joinedTimestamp);
    }, 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

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

  const isRoom = React.useMemo(() => liveGroup && liveGroup.isRoom, [
    liveGroup
  ]);

  if (!userGroup) {
    return null;
  }
  const showElapsedTime = () => {
    let elapsedMoment = moment.duration(elapsedTime, "milliseconds");
    return elapsedMoment.format();
  };

  const handleLeaveCall = () => {
    leaveCall(sessionId, userGroup, userId);
  };

  function handleMenuClose() {
    setMenuAnchorEl(null);
  }

  function handleMenu(event) {
    setMenuAnchorEl(event.currentTarget);
  }

  return (
    <div className={classes.groupContainer}>
      <LeaveCallDialog
        open={leaveCallOpen}
        handleLeaveCall={handleLeaveCall}
        setOpen={setLeaveCallOpen}
      />
      <Typography variant="caption" className={classes.title}>
        {isRoom ? liveGroup.roomName : "CURRENT CONVERSATION"} (
        {showElapsedTime()})
      </Typography>
      <div className={classes.avatarsContainer}>
        {!isRoom && <GroupAvatars group={participants} />}
        {isRoom && (
          <>
            <AvatarGroup max={4} spacing="medium">
              {participants.map((participant) => {
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
      </div>
      <div className={classes.leaveCallContainer}>
        {/* <Tooltip title="Leave conversation" placement="right"> */}
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
          //   horizontal: "right",
          // }}
          // transformOrigin={{
          //   vertical: "bottom",
          //   horizontal: "center",
          // }}
          keepMounted
          open={openMenu}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => setLeaveCallOpen(true)}>Leave Call</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CurrentCallActions;
