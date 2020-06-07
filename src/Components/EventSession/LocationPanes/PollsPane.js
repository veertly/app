import React, { useState } from "react";
import { makeStyles, /* Typography, Box , */ Button } from "@material-ui/core";
// import NoPollsImg from "../../../Assets/illustrations/polls.svg";
import { CreatePollDialog } from "../Polls/CreatePollDialog";

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
  const [createDialogOpen, setCreateDialogOpen] = useState(true);
  const isPollCreationAllowed = true;

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
      {isPollCreationAllowed && (
        <div className={classes.centerButton}>
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
        </div>
      )}
    </div>
  );
};

export default PollsPane;
