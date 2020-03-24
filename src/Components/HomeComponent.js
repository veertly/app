import React, { useState } from "react";
import Button from "@material-ui/core/Button";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import moment from "moment";
import { withRouter } from "react-router-dom";
import routes from "../Config/routes";
import CreateMeetupDialog from "./EventSession/CreateMeetupDialog";
import { useForm } from "react-hook-form/dist/react-hook-form.ie11"; // needed because of a minimifying issue: https://github.com/react-hook-form/react-hook-form/issues/773
import { TextField } from "@material-ui/core";

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {"Copyright © "}
//       <Link color="inherit" href="https://veertly.com/">
//         Veertly.com
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  },
  buttonJoin: {
    margin: "auto"
  },
  textField: {
    maxWidth: 300,
    margin: "auto"
  },
  button: {
    margin: 16,
    width: 250
  }
}));

export default withRouter(props => {
  const classes = useStyles();
  const { register, handleSubmit, setValue, watch } = useForm();

  const [openCreate, setOpenCreate] = useState(false);
  // const maxDateEvent = moment.unix(1568244349);
  const eventDate = moment.unix(1568185200);
  console.log(eventDate.calendar());
  // const currentTime = moment();
  // const isBeforeEvent = currentTime.isBefore(maxDateEvent);
  const onSubmit = async data => {
    console.log({ data });
    let { sessionId } = data;
    props.history.push(routes.EVENT_SESSION(sessionId));
    // let newUser = { ...user, displayName: `${data.firstName} ${data.lastName}` };
    // registerNewUser(newUser);
    // history.push(callbackUrl);
  };
  return (
    <React.Fragment>
      {/* Hero unit */}
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          {/* <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
            Create your own virtual meetup
          </Typography>

          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Attend a virtual meetup or event to learn something new, get more insights about fascinating topics and to
            build meaningful relationships to people all over the world!
          </Typography> */}

          <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
            Enter your conference room
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <TextField fullWidth value={user.displayName} label="Name" /> */}
            <div style={{ width: "100%", textAlign: "center", marginTop: 32 }}>
              <TextField
                fullWidth
                label="Conference Room"
                name="sessionId"
                variant="outlined"
                inputRef={register({ required: true })}
                className={classes.textField}
                // className={clsx(classes.flexGrow, classes.textField)}
              />
            </div>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Enter your conference
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => props.history.push(routes.EVENT_SESSION("demo"))}
                  >
                    Enter demo conference
                  </Button>
                </Grid>
              </Grid>
            </div>
          </form>

          {/* <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)}>
                  Create your Veertup
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => props.history.push(routes.EVENT_SESSION("demo"))}
                >
                  Test our platform
                </Button>
              </Grid>
            </Grid>
          </div> */}
        </Container>
      </div>

      <CreateMeetupDialog open={openCreate} setOpen={setOpenCreate} />
    </React.Fragment>
  );
});
