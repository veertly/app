import React, { useState } from "react";
import {
  makeStyles,
  /* Typography, Box , */ Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Box
} from "@material-ui/core";
// import NoPollsImg from "../../../Assets/illustrations/polls.svg";
import { CreatePollDialog } from "./CreatePollDialog";
import PollsContext from "../../../Contexts/PollsContext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  POLLS_NAMESPACES,
  POLLS_STATES
} from "../../../Modules/pollsOperations";
import PollForm from "./PollForm";
import PollResults from "./PollResults";

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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const isPollCreationAllowed = true;
  const { polls, myVotes } = React.useContext(PollsContext);
  console.log({ myVotes });
  return (
    <div>
      <CreatePollDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />

      {/* <Box className={classes.emptyPane}>
        <img
          className={classes.emptyImage}
          src={NoPollsImg}
          alt="Polls coming soon"
        />
        <Typography variant="body2" color="textSecondary" display="block">
          Coming soon...
        </Typography>
      </Box> */}
      {polls[POLLS_NAMESPACES.GLOBAL].map((poll) => {
        if (poll.state === POLLS_STATES.PUBLISHED) {
          return (
            <ExpansionPanel key={poll.id}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {poll.title}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {(!myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] ||
                  myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted !== true) && (
                  <PollForm poll={poll} />
                )}
                {myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] &&
                  myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted === true && (
                    <PollResults poll={poll} />
                  )}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        }
        return null;
      })}
      {isPollCreationAllowed && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.roomButton}
            onClick={() => setCreateDialogOpen(true)}
            // disabled={participantsAvailable.length <= 1}
          >
            Create poll
          </Button>
        </Box>
      )}
    </div>
  );
};

export default PollsPane;
