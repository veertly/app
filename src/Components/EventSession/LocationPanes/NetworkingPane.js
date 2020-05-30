import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import JoinConversationDialog from "../JoinConversationDialog";
import Divider from "@material-ui/core/Divider";
import GroupAvatars from "../GroupAvatars";

import { useSelector, shallowEqual } from "react-redux";
import { getUsers, getLiveGroups, getUser } from "../../../Redux/eventSession";
import _ from "lodash";
import NoConversationImg from "../../../Assets/illustrations/no_conversations.svg";
import { Box } from "@material-ui/core";
import AttendeesPane, { ATTENDEES_PANE_FILTER } from "./AttendeesPane";

const useStyles = makeStyles((theme) => ({
  root: {},
  groupContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      cursor: "pointer",
      borderRadius: 0
    }
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
    width: "80%",
    margin: "auto"
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
    textAlign: "center",
    padding: theme.spacing(0, 2)
  },
  emptyImage: {
    width: "65%",
    marginBottom: theme.spacing(1)
  }
}));
// rgba(28, 71, 98, 0.08)

export default function (props) {
  const classes = useStyles();
  const [joinDialog, setJoinDialog] = React.useState(false);

  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [selectedGroupId, setSelectedGroupId] = React.useState(null);

  // const { users, eventSession, user } = props;

  const users = useSelector(getUsers, shallowEqual);
  const user = useSelector(getUser, shallowEqual);
  const liveGroups = useSelector(getLiveGroups, shallowEqual);

  const { conversations } = React.useMemo(() => {
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
        {conversations.map((group, index) => {
          let isLast = index === numConversations - 1;
          return (
            <div key={group.id}>
              <div
                className={classes.groupContainer}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGroup(group.participants);
                  setSelectedGroupId(group.id);
                  setJoinDialog(true);
                }}
              >
                <GroupAvatars group={group.participants} />
                {/* {groupHover === group.id &&
                  group.participants.length < MAX_PARTICIPANTS_GROUP && (
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
                  )} */}
              </div>

              {!isLast && <Divider variant="middle" />}
            </div>
          );
        })}
        {numConversations === 0 && (
          <Box className={classes.emptyPane}>
            <img
              className={classes.emptyImage}
              src={NoConversationImg}
              alt="No conversations"
            />
            <Typography variant="body2" color="textSecondary" display="block">
              There are no conversations yet, check out the rooms or select
              someone and start networking!{" "}
            </Typography>
          </Box>
        )}
        <AttendeesPane
          paneFilter={ATTENDEES_PANE_FILTER.available}
          showFilter
          showStartConversation
          hideButtonsIfEmpty
        />
      </div>
    </div>
  );
}
