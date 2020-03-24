import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import moment from "moment";
import { withRouter } from "react-router-dom";
import routes from "../Config/routes";
import CreateMeetupDialog from "./EventSession/CreateMeetupDialog";

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
  }
}));

export default withRouter(props => {
  const classes = useStyles();

  const [openCreate, setOpenCreate] = useState(false);
  // const maxDateEvent = moment.unix(1568244349);
  const eventDate = moment.unix(1568185200);
  console.log(eventDate.calendar());
  // const currentTime = moment();
  // const isBeforeEvent = currentTime.isBefore(maxDateEvent);

  return (
    <React.Fragment>
      {/* Hero unit */}
      <div className={classes.heroContent}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
            BROADEN YOUR HORIZON
          </Typography>
          {/* We are digitizing Networking! */}

          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Attend a virtual meetup or event to learn something new, get more insights about fascinating topics and to
            build meaningful relationships to people all over the world!
          </Typography>
          <div className={classes.heroButtons}>
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
          </div>
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Typography gutterBottom align="center">
          Past Events
        </Typography>

        <Grid container spacing={4} direction="row" justify="center" alignItems="center">
          {/* {cards.map(card => ( */}
          {/* {isBeforeEvent && ( */}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image="https://images.unsplash.com/photo-1422393462206-207b0fbd8d6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80"
                title="Veertly Dry-run"
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  1<sup>st</sup> Veertly Dry-run
                </Typography>
                <Typography>Be the first to attend a Veertup and we will build the features you want!</Typography>
                <Typography variant="caption">{eventDate.calendar()}</Typography>
              </CardContent>
              {/* <CardActions>
                  <Button
                    className={classes.buttonJoin}
                    color="secondary"
                    variant="contained"
                    onClick={() => props.history.push(routes.EVENT_PAGE("veertly-dryrun-1"))}
                  >
                    Join
                  </Button>
                  
                </CardActions> */}
            </Card>
          </Grid>
          {/* )} */}
          {/* {!isBeforeEvent && <Typography>Create your own Veertup!</Typography>} */}
          {/* ))} */}
        </Grid>
      </Container>
      <CreateMeetupDialog open={openCreate} setOpen={setOpenCreate} />
    </React.Fragment>
  );
});
