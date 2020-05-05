import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import JoinConversationDialog from "./JoinConversationDialog";
import Divider from "@material-ui/core/Divider";
import GroupAvatars from "./GroupAvatars";
import { MAX_PARTICIPANTS_GROUP } from "../../Config/constants";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getUsers, getLiveGroups, getUser, getEventSessionDetails } from "../../Redux/eventSession";
import RoomCard from "./RoomCard";
import _ from "lodash";
import { Collapse } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { openCreateRoom } from "../../Redux/dialogs";

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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: "100%",
  },
  relativeContainer: {
    position: "relative",
  },
  title: {
    margin: theme.spacing(2, 2, 1, 2),
    display: "block",
    position: "relative",
    paddingLeft: theme.spacing(2.5),
    cursor: "pointer",
  },
  expandIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    color: theme.palette.secondary.main,
  },
  centerButton: {
    width: "100%",
    textAlign: "center",
  },
}));
// rgba(28, 71, 98, 0.08)

export default function (props) {
  const classes = useStyles();
  const [groupHover, setGroupHover] = React.useState(-1);
  const [joinDialog, setJoinDialog] = React.useState(false);

  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  const [roomsExpanded, setRoomsExpanded] = React.useState(true);
  const [conversationsExpanded, setConversationsExpanded] = React.useState(true);
  // const { users, eventSession, user } = props;
  const dispatch = useDispatch();

  const users = useSelector(getUsers, shallowEqual);
  const user = useSelector(getUser, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);

  const toggleExpandRooms = React.useCallback(() => setRoomsExpanded(!roomsExpanded), [roomsExpanded]);
  const toggleExpandConversations = React.useCallback(() => setConversationsExpanded(!conversationsExpanded), [
    conversationsExpanded,
  ]);

  const handleCreateRoom = React.useCallback(() => dispatch(openCreateRoom()), [dispatch]);
  const isRoomCreationAllowed = React.useMemo(
    () => !eventSessionDetails || eventSessionDetails.denyRoomCreation !== true,
    [eventSessionDetails]
  );
  const { rooms, conversations } = React.useMemo(() => {
    let rooms = [];
    let conversations = [];

    _.forEach(liveGroups, (group) => {
      let extendedGroup = { ...group };
      let participantsIds = Object.keys(group.participants);
      extendedGroup.participants = participantsIds.map((userId) => users[userId]);
      extendedGroup.isMyGoup = user && participantsIds.includes(user.id);

      if (extendedGroup.isRoom) {
        rooms.push(extendedGroup);
      } else {
        conversations.push(extendedGroup);
      }
    });
    return { rooms, conversations };
  }, [liveGroups, users, user]);

  const numConversations = conversations.length;
  return (
    <div className={classes.root}>
      <JoinConversationDialog
        open={joinDialog}
        setOpen={setJoinDialog}
        group={selectedGroup}
        groupId={selectedGroupId}
      />
      <div className={classes.relativeContainer}>
        <div className={classes.title} onClick={toggleExpandRooms}>
          <div className={classes.expandIcon}>{roomsExpanded ? <ExpandLess /> : <ExpandMore />}</div>
          <Typography color="secondary" align="left">
            ROOMS
          </Typography>
        </div>
        <Collapse in={roomsExpanded} timeout="auto" unmountOnExit>
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
        </Collapse>

        <div className={classes.title} onClick={toggleExpandConversations}>
          <div className={classes.expandIcon}>{conversationsExpanded ? <ExpandLess /> : <ExpandMore />}</div>
          <Typography color="secondary" align="left">
            CONVERSATIONS
          </Typography>
        </div>
        <Collapse in={conversationsExpanded} timeout="auto" unmountOnExit>
          {conversations.map((group, index) => {
            let isLast = index === numConversations - 1;
            return (
              <div key={group.id}>
                <div
                  className={classes.groupContainer}
                  onMouseEnter={() => {
                    setGroupHover(group.id);
                  }}
                  onMouseLeave={() => {
                    setGroupHover(-1);
                  }}
                >
                  <GroupAvatars group={group.participants} />
                  {groupHover === group.id && group.participants.length < MAX_PARTICIPANTS_GROUP && (
                    <div className={classes.joinButtonContainer}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.button}
                        onClick={() => {
                          setSelectedGroup(group.participants);
                          setSelectedGroupId(group.id);
                          setJoinDialog(true);
                        }}
                      >
                        {group.isMyGroup ? "View" : "Join"}
                      </Button>
                    </div>
                  )}
                </div>

                {!isLast && <Divider variant="middle" />}
              </div>
            );
          })}
          {numConversations === 0 && (
            <Typography variant="caption" align="center" display="block" className={classes.noGroupsText}>
              {/* There are no conversations yet, <br />
              select someone and start networking! */}
              There are no conversations yet, check out the topic rooms or select someone and start networking!
            </Typography>
          )}
        </Collapse>
      </div>
    </div>
  );
}
