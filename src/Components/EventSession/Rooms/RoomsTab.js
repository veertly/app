import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import JoinConversationDialog from "../JoinConversationDialog";
import NoRoomsImg from "../../../Assets/illustrations/undraw_group_hangout_5gmq.svg";
// undraw_group_hangout_5gmq
// conference_call
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getUsers,
  getLiveGroups,
  getUser,
  getEventSessionDetails,
  isEventOwner as isEventOwnerSelector
} from "../../../Redux/eventSession";
import RoomCard from "./RoomCard";
import _ from "lodash";
import { openCreateRoom } from "../../../Redux/dialogs";
import { Box, Typography } from "@material-ui/core";
import ReorderRoomsDialog from "./ReorderRoomsDialog";

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
  roomButton: {
    margin: theme.spacing(2)
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
  },
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "55%",
    marginBottom: theme.spacing(1)
  }
}));
// rgba(28, 71, 98, 0.08)

export default function ({ setRoomsCount }) {
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

  const isEventOwner = useSelector(isEventOwnerSelector);

  const isRoomCreationAllowed = React.useMemo(
    () =>
      !eventSessionDetails ||
      isEventOwner ||
      eventSessionDetails.denyRoomCreation !== true,
    [eventSessionDetails, isEventOwner]
  );
  const { rooms } = React.useMemo(() => {
    let rooms = [];
    let conversations = [];

    _.forEach(liveGroups, (group) => {
      let extendedGroup = { ...group };
      let participantsIds = Object.keys(group.participants);

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

    const sortedRooms = _.sortBy(rooms, "order");
    return { rooms: sortedRooms, conversations };
  }, [liveGroups, user, users]);

  useEffect(() => {
    setRoomsCount(rooms.length);
  }, [rooms.length, setRoomsCount]);

  return (
    <div className={classes.root}>
      <JoinConversationDialog
        open={joinDialog}
        setOpen={setJoinDialog}
        group={selectedGroup}
        groupId={selectedGroupId}
      />
      <ReorderRoomsDialog rooms={rooms} />
      <div className={classes.relativeContainer}>
        {rooms.length === 0 && (
          <Box className={classes.emptyPane}>
            <img
              className={classes.emptyImage}
              src={NoRoomsImg}
              alt="no rooms available"
            />
            {isRoomCreationAllowed && (
              <Typography variant="body2" color="textSecondary" display="block">
                There are no rooms available yet.
                <br />
                Create a topic room and start talking with others...
              </Typography>
            )}
            {!isRoomCreationAllowed && (
              <Typography variant="body2" color="textSecondary" display="block">
                The organizer has no rooms created yet. <br />
                Check again later.
              </Typography>
            )}
          </Box>
        )}
        {rooms.map((room) => {
          return <RoomCard key={room.id} room={room} />;
        })}
        {isRoomCreationAllowed && (
          <div className={classes.centerButton}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.roomButton}
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
