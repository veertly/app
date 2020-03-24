import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import routes from "../Config/routes";

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbarTitle: {
    flex: 1
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto"
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0
  },
  mainFeaturedPost: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage: "url(https://source.unsplash.com/user/erondu)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.3)"
  },
  mainFeaturedPostContent: {
    position: "relative",
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(6),
      paddingRight: 0
    }
  },
  mainGrid: {
    marginTop: theme.spacing(3)
  },
  card: {
    display: "flex"
  },
  cardDetails: {
    flex: 1
  },
  cardMedia: {
    width: 160
  },
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200]
  },
  sidebarSection: {
    marginTop: theme.spacing(3)
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(8),
    padding: theme.spacing(6, 0)
  }
}));

function Home({ meetups }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper className={classes.mainFeaturedPost}>
        {<img style={{ display: "none" }} src="amplify configure" alt="background" />}
        <div className={classes.overlay} />
        <Grid container>
          <Grid item md={6}>
            <div className={classes.mainFeaturedPostContent}>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Create your own Veertly!
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Break the physical barrier and organize a virtual meetup with anyone from around the world! We promise
                the same experience as a face-to-face meetup, only the drinks and eats we can't make it... yet!
              </Typography>
              <Link variant="subtitle1" to="/">
                Continue reading…
              </Link>
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4} className={classes.cardGrid}>
        {meetups.map(meetup => (
          <Grid item xs={12} md={6}>
            <Link key={meetup.id} to={routes.MEETUP_PAGE(meetup.id)}>
              <CardActionArea component="a" href="#">
                <Card className={classes.card}>
                  <div className={classes.cardDetails}>
                    <CardContent>
                      <Typography component="h2" variant="h5">
                        {meetup.title}
                      </Typography>
                      {/* <Typography variant="subtitle1" color="textSecondary">
                      TBD
                    </Typography> */}
                      <Typography variant="subtitle1" paragraph>
                        {meetup.description}
                      </Typography>
                      <Typography variant="subtitle1" color="primary">
                        Continue reading...
                      </Typography>
                    </CardContent>
                  </div>
                  {meetup.image && (
                    <Hidden xsDown>
                      <CardMedia
                        className={classes.cardMedia}
                        image={meetup.image ? meetup.image : "https://source.unsplash.com/random"}
                        title="Image title"
                      />
                    </Hidden>
                  )}
                </Card>
              </CardActionArea>
            </Link>
          </Grid>
        ))}
      </Grid>
      {/* End sub featured posts */}
      {/* <Grid container spacing={5} className={classes.mainGrid}>
        <div>
          <div className="ui clearing basic segment">
            <h1 className="ui header left floated">All Events</h1>
          </div>
          <div className="ui link cards">
            <div className="card blue">
              <Link to="/newEvent" className="new-event content center aligned">
                <i className="icon add massive" />
                <p>Create new event</p>
              </Link>
            </div>
            {[]
              .concat(events)
              .sort((a, b) => a.when.localeCompare(b.when))
              .map(renderEvent)}
          </div>
        </div>
      </Grid> */}
    </React.Fragment>
  );
}

export default Home;
