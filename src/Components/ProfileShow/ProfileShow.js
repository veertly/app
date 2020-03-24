import React from "react";
import PaddedPaper from "../Core/PaddedPaper";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Box, Avatar, Divider, Button } from "@material-ui/core";

const styles = theme => ({
  row: {
    flexDirection: "row"
  },
  button: {
    margin: theme.spacing(1)
  },
  bigAvatar: {
    margin: 10,
    width: 120,
    height: 120
  }
});

function Profileshow(props) {
  const { classes, user } = props;

  return (
    <React.Fragment>
      <PaddedPaper>
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <Avatar src={user.photoURL} alt="Profile" className={classes.bigAvatar}></Avatar>
          <Box>
            <Typography variant="h2">{user.displayName}</Typography>
            <Typography>{user.email}</Typography>
          </Box>
          <Button variant="outlined" className={classes.button}>
            <a href="/profile/edit">Edit</a>
          </Button>
        </Box>

        <Divider />
        <Typography variant="h4">Upcoming Meetups</Typography>
        <Typography variant="i">There are not upcoming veertups</Typography>
        <Typography variant="h4">Past Meetups</Typography>
        <Typography variant="i">You didn't join any veertup.</Typography>
      </PaddedPaper>
    </React.Fragment>
  );
}

export default withStyles(styles)(Profileshow);
