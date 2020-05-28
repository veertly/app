import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import JoinConversationDialog from "./JoinConversationDialog";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getUsers,
  getLiveGroups,
  getUser,
  getEventSessionDetails
} from "../../Redux/eventSession";
import RoomCard from "./RoomCard";
import _ from "lodash";
import { openCreateRoom } from "../../Redux/dialogs";

const useStyles = makeStyles((theme) => ({
  root: {},
  groupContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    position: "relative"
  },
  participantContainer: {
    marginRight: theme.spacing(2)
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
  joinButtonContainer: {
    position: "absolute",
    right: 0,
    top: theme.spacing(2)
  },
  noGroupsText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: "100%"
  },
  relativeContainer: {
    position: "relative"
  },
  title: {
    margin: theme.spacing(2, 2, 1, 2),
    display: "block",
    position: "relative",
    paddingLeft: theme.spacing(2.5),
    cursor: "pointer"
  },
  expandIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    color: theme.palette.secondary.main
  },
  centerButton: {
    width: "100%",
    textAlign: "center"
  }
}));
// rgba(28, 71, 98, 0.08)

export default function (props) {
  const classes = useStyles();
  const [joinDialog, setJoinDialog] = React.useState(false);

  const [selectedGroup /* setSelectedGroup */] = React.useState(null);
  const [selectedGroupId /* setSelectedGroupId */] = React.useState(null);

  // const { users, eventSession, user } = props;
  const dispatch = useDispatch();

  const users = useSelector(getUsers, shallowEqual);
  const user = useSelector(getUser, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const handleCreateRoom = React.useCallback(() => dispatch(openCreateRoom()), [
    dispatch
  ]);
  const isRoomCreationAllowed = React.useMemo(
    () => !eventSessionDetails || eventSessionDetails.denyRoomCreation !== true,
    [eventSessionDetails]
  );
  const { rooms } = React.useMemo(() => {
    let rooms = [];
    let conversations = [];

    _.forEach(liveGroups, (group) => {
      let extendedGroup = { ...group };
      let participantsIds = Object.keys(group.participants);
      // participantsIds = participantsIds.concat(participantsIds);
      // participantsIds = participantsIds.concat(participantsIds);
      // participantsIds = participantsIds.concat(participantsIds);
      // participantsIds = participantsIds.concat(participantsIds);
      // participantsIds = participantsIds.concat(participantsIds);

      extendedGroup.participants = participantsIds.map(
        (userId) => users[userId]
      );
      extendedGroup.isMyGroup = user && participantsIds.includes(user.id);

      if (extendedGroup.isRoom) {
        rooms.push(extendedGroup);
      } else {
        conversations.push(extendedGroup);
      }
    });
    return { rooms, conversations };
  }, [liveGroups, users, user]);

  return (
    <div className={classes.root}>
      <JoinConversationDialog
        open={joinDialog}
        setOpen={setJoinDialog}
        group={selectedGroup}
        groupId={selectedGroupId}
      />
      <div className={classes.relativeContainer}>
        {rooms.map((room) => {
          return <RoomCard key={room.id} room={room} />;
        })}
        {isRoomCreationAllowed && (
          <div className={classes.centerButton}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.button}
              onClick={handleCreateRoom}
              // disabled={participantsAvailable.length <= 1}
            >
              Create room
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
