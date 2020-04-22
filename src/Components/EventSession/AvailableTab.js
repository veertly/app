import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import LinkedinIcon from "../../Assets/Icons/Linkedin";
import TwitterIcon from "../../Assets/Icons/Twitter";
import KeybaseIcon from "../../Assets/Icons/Keybase";
import Button from "@material-ui/core/Button";
import JoinParticipantDialog from "./JoinParticipantDialog";
import Badge from "@material-ui/core/Badge";
import ConversationsIcon from "../../Assets/Icons/Conversations";
import { Tooltip } from "@material-ui/core";
import ConferenceIcon from "@material-ui/icons/DesktopMac";
import FilterAttendeesDialog from "./FilterAttendeesDialog";

import { useSelector, shallowEqual } from "react-redux";
import { getUsers, isInNetworkingRoom, getAvailableParticipantsList } from "../../Redux/eventSession";

// import JoinConversationDialog from "./JoinConversationDialog";
import _ from "lodash";
const useStyles = makeStyles((theme) => ({
  root: {},
  participantContainer: {
    "&:hover": {
      backgroundColor: "rgba(28, 71, 98, 0.08)", //"#e0f3ff", //"#e4ffe4",
      cursor: "pointer",
      borderRadius: 0,
    },
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    display: "flex",
  },
  participantDetails: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    position: "relative",
  },
  topicsInterested: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 190,
  },
  avatar: {
    marginTop: 1,
  },
  socialContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    // wi dth: 16,
    color: theme.palette.text.secondary,
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(1),
    display: "block",
  },
}));
// rgba(28, 71, 98, 0.08)

const AvailableBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: theme.palette.secondary.main, //"#44b700",
    color: theme.palette.secondary.main, //"#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

export default function (props) {
  const classes = useStyles();
  const [joinDialog, setJoinDialog] = React.useState(false);
  const [filterDialog, setFilterDialog] = React.useState(false);
  const [selectedParticipant, setSelectedParticipant] = React.useState(null);
  const [showJoinButton, setShowJoinButton] = React.useState(false);

  // const { users, eventSession, user, onConferenceRoom } = props;

  const users = useSelector(getUsers, shallowEqual);
  const onConferenceRoom = !useSelector(isInNetworkingRoom);
  const availableParticipantsList = useSelector(getAvailableParticipantsList, shallowEqual);

  const [filters, setFilters] = React.useState({});

  let participantsAvailable = React.useMemo(() => {
    let result = availableParticipantsList.filter((participantSession) => {
      let participant = users[participantSession.id];

      if (!participant) {
        return false;
      }

      // check interests
      if (_.size(filters) !== 0) {
        let { interestsChips } = participant;

        let foundInterest = false;

        for (let i = 0; i < interestsChips.length; i++) {
          let interest = interestsChips[i];
          if (filters[interest.label] === true) {
            foundInterest = true;
          }
        }

        if (!foundInterest) {
          return false;
        }
      }

      return true;
    });

    // console.log("Num participants: " + result.length);
    return result;
  }, [availableParticipantsList, users, filters]);

  const feelingLucky = React.useCallback(() => {
    let selectedParticipantSession = _.sample(
      participantsAvailable.filter(({ isMyUser, isAvailable }) => !isMyUser && isAvailable)
    );
    let participant = selectedParticipantSession ? users[selectedParticipantSession.id] : null;
    // if (participantsAvailable.length > 1) {
    //   let tries = 0;
    //   let findUser = () => {
    //     let index = Math.floor(Math.random() * participantsAvailable.length);
    //     let userId = participantsAvailable[index];
    //     let sessionParticipant = participantsJoined[userId];

    //     if (tries < 5 && (userId === myUserId || !sessionParticipant.inNetworkingRoom)) {
    //       tries++;
    //       return findUser();
    //     }

    //     return users[userId];
    //   };
    //   let participant = findUser();
    setSelectedParticipant(participant);
    setJoinDialog(true);
  }, [participantsAvailable, users]);

  return (
    <div className={classes.root}>
      <JoinParticipantDialog
        open={joinDialog}
        setOpen={setJoinDialog}
        participant={selectedParticipant}
        // eventSession={eventSession}
        // user={user}
        // onConferenceRoom={onConferenceRoom}
        showJoinButton={showJoinButton}
      />
      <FilterAttendeesDialog
        open={filterDialog}
        setOpen={setFilterDialog}
        participant={selectedParticipant}
        // eventSession={eventSession}
        // user={user}
        // users={users}
        filters={filters}
        setFilters={setFilters}
        // onConferenceRoom={onConferenceRoom}
        // showJoinButton={showJoinButton}
      />

      {!onConferenceRoom && (
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.button}
            onClick={feelingLucky}
            disabled={participantsAvailable.length <= 1}
          >
            I'm feeling lucky
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.button}
            onClick={() => {
              setFilterDialog(true);
            }}
          >
            Filter
          </Button>
        </div>
      )}
      {onConferenceRoom && (
        <Typography variant="overline" className={classes.title} align="center">
          All attendees ({participantsAvailable.length})
        </Typography>
      )}
      {participantsAvailable.map((participantSession, index) => {
        let { isInConversation, isInConferenceRoom, isAvailable, isMyUser } = participantSession;

        let participant = users[participantSession.id];

        const hasSubtitle = participant.company.trim() !== "" || participant.companyTitle.trim() !== "";

        const participantAvatar = participant.avatarUrl ? (
          <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
        ) : (
          <Avatar className={classes.avatar}>
            {participant.firstName.charAt(0).toUpperCase()}
            {participant.lastName.charAt(0).toUpperCase()}
          </Avatar>
        );

        return (
          <div
            className={classes.participantContainer}
            onClick={() => {
              setSelectedParticipant(participant);
              setShowJoinButton(!isMyUser && isAvailable);
              setJoinDialog(true);
            }}
            key={index}
          >
            {isAvailable && (
              <Tooltip title="Available for a conversation">
                <AvailableBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  {participantAvatar}
                </AvailableBadge>
              </Tooltip>
            )}
            {isInConversation && (
              <Tooltip title="Currently in a conversation">
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeContent={<ConversationsIcon style={{ heigth: "0.85em", width: "0.85em" }} color="primary" />}
                >
                  {participantAvatar}
                </Badge>
              </Tooltip>
            )}
            {isInConferenceRoom && (
              <Tooltip title="Watching on the main stage">
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeContent={<ConferenceIcon style={{ heigth: "0.85em", width: "0.85em", color: "#666" }} />}
                >
                  {participantAvatar}
                </Badge>
              </Tooltip>
            )}
            <div className={classes.participantDetails} style={{ paddingTop: hasSubtitle ? 0 : 8 }}>
              <Typography variant="subtitle1">{`${participant.firstName} ${participant.lastName}`}</Typography>

              {hasSubtitle && (
                <Typography color="textSecondary" variant="caption" className={classes.topicsInterested}>
                  {`${participant.companyTitle}${participant.companyTitle.trim() !== "" ? " @ " : ""}${
                    participant.company
                  }`}
                </Typography>
              )}

              <div className={classes.socialContainer} style={{ top: hasSubtitle ? 0 : 8 }}>
                {participant.keybaseUrl && <KeybaseIcon className={classes.socialIcon} />}
                {participant.twitterUrl && <TwitterIcon className={classes.socialIcon} />}
                {participant.linkedinUrl && <LinkedinIcon className={classes.socialIcon} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
