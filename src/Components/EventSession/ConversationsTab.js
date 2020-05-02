import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import JoinConversationDialog from "./JoinConversationDialog";
import Divider from "@material-ui/core/Divider";
import GroupAvatars from "./GroupAvatars";
import { MAX_PARTICIPANTS_GROUP } from "../../Config/constants";

import { useSelector, shallowEqual } from "react-redux";
import { getUsers, getParticipantsJoined, getLiveGroups, getUser } from "../../Redux/eventSession";
import RoomCard from "./RoomCard";

const useStyles = makeStyles((theme) => ({
  root: {},
  groupContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    position: "relative",
  },
  participantContainer: {
    marginRight: theme.spacing(2),
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
  linkedin: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 16,
    color: theme.palette.text.secondary,
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
  joinButtonContainer: {
    position: "absolute",
    right: 0,
    top: theme.spacing(2),
  },
  noGroupsText: {
    position: "absolute",
    top: 60,
    width: "100%",
  },
  relativeContainer: {
    position: "relative",
  },
}));
// rgba(28, 71, 98, 0.08)

export default function (props) {
  const classes = useStyles();
  const [groupHover, setGroupHover] = React.useState(-1);
  const [joinDialog, setJoinDialog] = React.useState(false);

  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  // const { users, eventSession, user } = props;

  const users = useSelector(getUsers, shallowEqual);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);
  const user = useSelector(getUser, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);

  const groupIds = Object.keys(liveGroups ? liveGroups : {});
  const numGroups = groupIds.length;
  let hasGroupsLive = false;
  return (
    <div className={classes.root}>
      <JoinConversationDialog
        open={joinDialog}
        setOpen={setJoinDialog}
        group={selectedGroup}
        groupId={selectedGroupId}
        // eventSession={eventSession}
        // user={user}
      />
      <div className={classes.relativeContainer}>
        {groupIds.map((groupId, index) => {
          let groupData = liveGroups[groupId];
          let groupUserIds = Object.keys(groupData.participants);

          let liveParticipants = groupUserIds.filter((userId) => {
            let participantMetadata = groupData.participants[userId];
            let sessionParticipant = participantsJoined[userId];
            return !participantMetadata.leftTimestamp && sessionParticipant && sessionParticipant.isOnline;
          });

          let participants = liveParticipants.map((userId) => users[userId]);
          let hasLiveParticipants =
            liveParticipants.filter((participant) => participant.leftTimestamp !== null).length > 0;
          let isLast = index === numGroups - 1;

          let isMyGroup = liveParticipants.includes(user.id);

          if (groupData.isRoom) {
            hasGroupsLive = true;

            return (
              <RoomCard key={index} group={groupData} participants={groupUserIds.map((userId) => users[userId])} />
            );
          }

          if (!hasLiveParticipants) {
            return null;
          }
          hasGroupsLive = true;
          return (
            <div key={index}>
              <div
                className={classes.groupContainer}
                onMouseEnter={() => {
                  setGroupHover(index);
                }}
                onMouseLeave={() => {
                  setGroupHover(-1);
                }}
              >
                <GroupAvatars group={participants} />
                {groupHover === index && participants.length < MAX_PARTICIPANTS_GROUP && (
                  <div className={classes.joinButtonContainer}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      className={classes.button}
                      onClick={() => {
                        setSelectedGroup(participants);
                        setSelectedGroupId(groupId);
                        setJoinDialog(true);
                      }}
                    >
                      {isMyGroup ? "View" : "Join"}
                    </Button>
                  </div>
                )}
              </div>

              {!isLast && <Divider variant="middle" />}
            </div>
          );
        })}
        {!hasGroupsLive && (
          <Typography variant="caption" align="center" className={classes.noGroupsText}>
            There are no conversations yet, <br />
            so select someone and start networking!
          </Typography>
        )}
      </div>
    </div>
  );
}
