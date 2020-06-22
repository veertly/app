import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import LinkedinIcon from "../../../Assets/Icons/Linkedin";
import TwitterIcon from "../../../Assets/Icons/Twitter";
// import KeybaseIcon from "../../Assets/Icons/Keybase";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import { Tooltip } from "@material-ui/core";
import FilterAttendeesDialog from "../FilterAttendeesDialog";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getUsers,
  getAvailableParticipantsList,
  getFilters,
  getUserId
} from "../../../Redux/eventSession";

// import JoinConversationDialog from "./JoinConversationDialog";
import _ from "lodash";
import { openJoinParticipant } from "../../../Redux/dialogs";
import Flag from "../../Misc/Flag";
import { trackEvent } from "../../../Modules/analytics";
import {
  isParticipantAvailableForCall,
  isParticipantMainStage,
  participantHasFlag,
  participantHasSocials,
  participantHasSubtitle,
  isParticipantBackstage
} from "../../../Helpers/participantsHelper";
import ParticipantRole from "../../Misc/ParticipantRole";

const useStyles = makeStyles((theme) => ({
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
    width: 190
  },
  avatar: {
    marginTop: 1
  },
  socialContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    // wi dth: 16,
    color: theme.palette.text.secondary
  },
  flagContainer: {
    position: "absolute",
    right: 0,
    bottom: 0
    // wi dth: 16,
    // color: theme.palette.text.secondary,
  },
  name: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 155
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    position: "sticky",
    top: -8,
    paddingTop: theme.spacing(1),
    backgroundColor: "#fff",
    zIndex: 2
  },
  button: {
    margin: theme.spacing(1)
  },
  filterButton: ({ filters }) => ({
    backgroundColor:
      filters && Object.keys(filters).length > 0
        ? theme.palette.filtersSelected
        : "transparent"
  }),
  title: {
    marginTop: theme.spacing(1),
    display: "block"
  }
}));
// rgba(28, 71, 98, 0.08)

const AvailableBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
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
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}))(Badge);

export const ATTENDEES_PANE_FILTER = {
  all: "ALL",
  mainStage: "MAIN_STAGE",
  backstage: "BACKSTAGE",
  available: "AVAILABLE"
};

export default function ({
  paneFilter,
  setIsEmptyPane = (isEmpty) => {},
  showFilter = false,
  showStartConversation = false,
  showSearch = false,
  hideButtonsIfEmpty = false,
  setTotalUsers = (count) => {}
}) {
  const [filterDialog, setFilterDialog] = React.useState(false);

  const filters = useSelector(getFilters); //TODO: remove from redux
  const classes = useStyles({ filters });
  const dispatch = useDispatch();

  const users = useSelector(getUsers, shallowEqual);
  const myUserId = useSelector(getUserId, shallowEqual);
  const allParticipantsList = useSelector(
    getAvailableParticipantsList,
    shallowEqual
  );

  const scopedParticipants = React.useMemo(() => {
    const result = allParticipantsList.filter((participantSession) => {
      const participant = users[participantSession.id];
      const isMyUser = participantSession.id === myUserId;

      if (!participant) {
        return false;
      }

      let isFiltered = false;
      if (paneFilter === ATTENDEES_PANE_FILTER.available) {
        isFiltered =
          !isMyUser && isParticipantAvailableForCall(participantSession);
      } else if (paneFilter === ATTENDEES_PANE_FILTER.mainStage) {
        isFiltered = isParticipantMainStage(participantSession);
      } else if (paneFilter === ATTENDEES_PANE_FILTER.backstage) {
        isFiltered = isParticipantBackstage(participantSession);
      } else {
        isFiltered = true; // show all attendees
      }

      return isFiltered;
    });
    return result;
  }, [allParticipantsList, users, myUserId, paneFilter]);

  const filteredParticipants = React.useMemo(() => {
    const result = scopedParticipants.filter((participantSession) => {
      const participant = users[participantSession.id];

      let isFiltered = true;
      if (showFilter) {
        // check interests
        if (_.size(filters) !== 0) {
          const { interestsChips } = participant;

          let foundInterest = false;

          for (let i = 0; i < interestsChips.length; i++) {
            const interest = interestsChips[i];
            if (filters[interest.label] === true) {
              foundInterest = true;
            }
          }
          isFiltered = foundInterest;
        }
      }

      return isFiltered;
    });
    return result;
  }, [scopedParticipants, users, showFilter, filters]);

  React.useEffect(() => {
    setIsEmptyPane(filteredParticipants.length === 0);
    setTotalUsers(filteredParticipants.length);
  }, [filteredParticipants.length, setIsEmptyPane, setTotalUsers]);

  const feelingLucky = React.useCallback(() => {
    let selectedParticipantSession = _.sample(filteredParticipants);
    // console.log({ selectedParticipantSession });
    let participant = selectedParticipantSession
      ? users[selectedParticipantSession.id]
      : null;

    dispatch(openJoinParticipant(participant));

    trackEvent("Feeling lucky clicked", {});
  }, [filteredParticipants, users, dispatch]);

  return (
    <div className={classes.root}>
      {/* <JoinParticipantDialog /> */}
      {showFilter && (
        <FilterAttendeesDialog
          open={filterDialog}
          setOpen={setFilterDialog}
          filters={filters}
        />
      )}

      {(showFilter || showStartConversation || showSearch) &&
        ((hideButtonsIfEmpty && scopedParticipants.length > 0) ||
          !hideButtonsIfEmpty) && (
          <div className={classes.buttonContainer}>
            {showStartConversation && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.button}
                onClick={feelingLucky}
                disabled={filteredParticipants.length === 0}
              >
                Start a conversation
              </Button>
            )}
            {showFilter && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={`${classes.button} ${classes.filterButton}`}
                onClick={() => {
                  setFilterDialog(true);
                  trackEvent("Filter clicked", {});
                }}
              >
                Filter
              </Button>
            )}
          </div>
        )}

      {filteredParticipants.map((participantSession, index) => {
        let isAvailable = isParticipantAvailableForCall(participantSession);

        let participant = users[participantSession.id];

        const hasSubtitle = participantHasSubtitle(participant);
        const hasSocials = participantHasSocials(participant);
        const hasFlag =
          participantHasFlag(participant) ||
          (participant.roles && participant.roles.length > 0);

        const participantAvatar = participant.avatarUrl ? (
          <Avatar
            alt={participant.firstName}
            src={participant.avatarUrl}
            className={classes.avatar}
          />
        ) : (
          <Avatar className={classes.avatar}>
            {participant.firstName.charAt(0).toUpperCase()}
            {participant.lastName.charAt(0).toUpperCase()}
          </Avatar>
        );

        // const getRole = () => {
        //   if (participant.roles && participant.roles.length > 0) {
        //     let roleKey = participant.roles[0];
        //     if (participant.roles.includes(ROLES.SPEAKER.key)) {
        //       roleKey = ROLES.SPEAKER.key;
        //     } else if (participant.roles.includes(ROLES.HOST.key)) {
        //       roleKey = ROLES.HOST.key;
        //     }
        //     return <Label color="primary">{ROLES[roleKey].label}</Label>;
        //   }
        //   return null;
        // };

        return (
          <div
            className={classes.participantContainer}
            onClick={() => {
              dispatch(openJoinParticipant(participant));
            }}
            key={index}
          >
            {isAvailable && (
              <Tooltip title="Available for a conversation">
                <AvailableBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                  }}
                  variant="dot"
                >
                  {participantAvatar}
                </AvailableBadge>
              </Tooltip>
            )}
            {!isAvailable && participantAvatar}

            <div
              className={classes.participantDetails}
              style={{ paddingTop: hasSubtitle ? 0 : 8 }}
            >
              <Typography
                variant="subtitle1"
                className={classes.name}
                style={{ width: hasSocials || hasFlag ? 155 : 190 }}
              >{`${participant.firstName} ${participant.lastName}`}</Typography>

              {hasSubtitle && (
                <Typography
                  color="textSecondary"
                  variant="caption"
                  className={classes.topicsInterested}
                  style={{ width: hasFlag ? 155 : 190 }}
                >
                  {`${participant.companyTitle}${
                    participant.companyTitle.trim() !== "" ? " @ " : ""
                  }${participant.company}`}
                </Typography>
              )}

              <div
                className={classes.socialContainer}
                style={{ top: hasSubtitle || hasFlag ? 0 : 8 }}
              >
                {/* {participant.keybaseUrl && <KeybaseIcon className={classes.socialIcon} />} */}
                {participant.twitterUrl && (
                  <TwitterIcon className={classes.socialIcon} />
                )}
                {participant.linkedinUrl && (
                  <LinkedinIcon className={classes.socialIcon} />
                )}
              </div>
              <div
                className={classes.flagContainer}
                style={{ top: hasSocials ? null : hasSubtitle ? 0 : 10 }}
              >
                <Flag locationDetails={participant.locationDetails} />
                <ParticipantRole roles={participant.roles} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
