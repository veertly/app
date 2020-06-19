import React from "react";
import {
  makeStyles,
  /* Typography, Box , */ Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Box,
  SvgIcon
} from "@material-ui/core";
import NoPollsImg from "../../../Assets/illustrations/polls.svg";
import PollsContext from "../../../Contexts/PollsContext";
import PollsDialogsContext from "../../../Contexts/PollsDialogsContext";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  POLLS_NAMESPACES,
  POLLS_STATES
} from "../../../Modules/pollsOperations";
import PollForm from "./PollForm";
import PollResults from "./PollResults";
import {
  getEventSessionDetails,
  isEventOwner as isEventOwnerSelector,
  getUserId
} from "../../../Redux/eventSession";
import { useSelector, shallowEqual } from "react-redux";
import PollsMenu from "./PollsMenu";
import _ from "lodash";
import LiveIcon from "../../../Assets/Icons/Live";
import DraftIcon from "../../../Assets/Icons/Draft";
import { Archive as ArchiveIcon } from "react-feather";

const useStyles = makeStyles((theme) => ({
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "55%",
    marginBottom: theme.spacing(1)
  },
  centerButton: {
    width: "100%",
    textAlign: "center"
  }
}));

const PollsPane = () => {
  const classes = useStyles();

  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  const isEventOwner = useSelector(isEventOwnerSelector);

  const isPollCreationAllowed = React.useMemo(
    () =>
      isEventOwner ||
      (eventSessionDetails && eventSessionDetails.allowPollCreation === true),
    [eventSessionDetails, isEventOwner]
  );

  const canSeePreviousPolls = React.useMemo(
    () =>
      isEventOwner ||
      (eventSessionDetails &&
        eventSessionDetails.canSeePreviousPolls !== false),
    [eventSessionDetails, isEventOwner]
  );

  const myUserId = useSelector(getUserId);

  const { polls, myVotes } = React.useContext(PollsContext);
  const { setOpenCreateDialogPoll } = React.useContext(PollsDialogsContext);

  const publishedPolls = React.useMemo(() => {
    let result = _.filter(
      polls[POLLS_NAMESPACES.GLOBAL],
      (p) => p.state === POLLS_STATES.PUBLISHED
    );
    return result;
  }, [polls]);

  const draftPolls = React.useMemo(() => {
    let result = _.filter(
      polls[POLLS_NAMESPACES.GLOBAL],
      (p) => p.state === POLLS_STATES.DRAFT && p.owner === myUserId
    );
    return result;
  }, [myUserId, polls]);

  const stoppedPolls = React.useMemo(() => {
    let result = _.filter(
      polls[POLLS_NAMESPACES.GLOBAL],
      (p) =>
        p.state === POLLS_STATES.TERMINATED &&
        (p.owner === myUserId || isEventOwner || canSeePreviousPolls)
    );
    return result;
  }, [canSeePreviousPolls, isEventOwner, myUserId, polls]);

  // const hasDraft = useMemo(() => {
  //   isEventOwner && _.findIndex(polls, (p) => p.state === POLLS_STATES.DRAFT);
  // }, [isEventOwner, polls]);

  return (
    <div>
      {publishedPolls.length === 0 && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src={NoPollsImg}
            alt="No polls available"
          />
          {isPollCreationAllowed && (
            <Typography variant="body2" color="textSecondary" display="block">
              There are no polls available yet.
              <br />
              Create a poll and start gathering feedback...
            </Typography>
          )}
          {!isPollCreationAllowed && (
            <Typography variant="body2" color="textSecondary" display="block">
              The organizer hasn't created any poll yet. <br />
              Check again later.
            </Typography>
          )}
        </Box>
      )}
      {publishedPolls.length > 0 && (
        <>
          <Box m={2} display="flex">
            <LiveIcon color="primary" style={{ marginRight: 8 }} />
            <Typography variant="button" color="primary">
              Live Polls
            </Typography>
          </Box>
          {publishedPolls.map((poll, index) => {
            const canManagePoll = poll.owner === myUserId || isEventOwner;
            const totalVotes = _.sum(Object.values(poll.votesCounter));
            return (
              <ExpansionPanel key={poll.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div>
                    <Typography className={classes.heading}>
                      {poll.title}
                    </Typography>

                    <Typography variant="caption" color="textSecondary">
                      {totalVotes > 0
                        ? `${totalVotes} vote${totalVotes !== 1 ? "s" : ""}`
                        : "Be the first one to vote"}
                    </Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{ paddingTop: 0, display: "block" }}
                >
                  {(!myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] ||
                    myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted !==
                      true) && <PollForm poll={poll} />}
                  {myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] &&
                    myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted ===
                      true && <PollResults poll={poll} />}
                  {canManagePoll && <PollsMenu poll={poll} />}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </>
      )}
      {isPollCreationAllowed && (
        <Box textAlign="center" mt={3} mb={3}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.roomButton}
            onClick={() => setOpenCreateDialogPoll(true)}
            // disabled={participantsAvailable.length <= 1}
          >
            Create poll
          </Button>
        </Box>
      )}
      {draftPolls.length > 0 && (
        <>
          <Box m={2} mt={6} display="flex">
            <SvgIcon color="primary" style={{ marginRight: 8 }}>
              <DraftIcon />
            </SvgIcon>
            <Typography variant="button" color="primary">
              Draft Polls
            </Typography>

            {/* <Box textAlign="right" flexGrow={1}>
              <IconButton
                size="small"
                style={{ marginTop: -4, padding: 0 }}
                color="primary"
              >
                <ExpandMoreIcon />
              </IconButton> 
            </Box>*/}
          </Box>
          {draftPolls.map((poll) => {
            const canManagePoll = poll.owner === myUserId || isEventOwner;
            return (
              <ExpansionPanel key={poll.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    {poll.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{ paddingTop: 0, display: "block" }}
                >
                  <PollForm poll={poll} />
                  {canManagePoll && <PollsMenu poll={poll} />}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </>
      )}
      {stoppedPolls.length > 0 && (
        <>
          <Box m={2} mt={6} display="flex">
            <SvgIcon color="primary" style={{ marginRight: 8 }}>
              <ArchiveIcon />
            </SvgIcon>
            <Typography variant="button" color="primary">
              Previous Polls
            </Typography>
          </Box>
          {stoppedPolls.map((poll) => {
            const canManagePoll = poll.owner === myUserId || isEventOwner;
            const totalVotes = _.sum(Object.values(poll.votesCounter));
            return (
              <ExpansionPanel key={poll.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div>
                    <Typography className={classes.heading}>
                      {poll.title}
                    </Typography>

                    <Typography variant="caption" color="textSecondary">
                      {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                    </Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{ paddingTop: 0, display: "block" }}
                >
                  <PollResults poll={poll} />
                  {canManagePoll && <PollsMenu poll={poll} />}
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}
        </>
      )}
      <div></div>
    </div>
  );
};

// const PollsPane = () => {
//   return (
//     <PollsContextWrapper>
//       <PollsPaneContent />
//     </PollsContextWrapper>
//   );
// };

export default PollsPane;
