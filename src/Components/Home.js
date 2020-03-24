import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';


import moment from "moment";

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    backgroundImage: 'url(https://source.unsplash.com/user/erondu)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(8),
    padding: theme.spacing(6, 0),
  },
}));

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
  },
];


function Home ({ events }) {


  const renderEvent = (event) => (
    <Link to={`/event/${event.id}`} className="card" key={event.id}>
      <div className="content">
        <div className="header">{event.name}</div>
      </div>
      <div className="content">
        <p><i className="icon calendar"></i>{moment(event.when).format('LL')}</p>
        <p><i className="icon android"></i>{moment(event.when).format('LT')}</p>
        <p><i className="icon marker"></i>{event.where}</p>
      </div>
      <div className="content">
        <div className="description"><i className="icon info circle"></i>{event.description}</div>
      </div>
      <div className="extra content">
        <i className="icon comment"></i> {event.comments.items.length} comments
            </div>
      <button className="ui bottom attached button" /*onClick={this.handleDeleteClick.bind(this, event)} */>
        <i className="trash icon"></i>
        Delete
            </button>
    </Link>
  );

  const classes = useStyles();

  return (<React.Fragment>
    <Paper className={classes.mainFeaturedPost} >
      {
        <img
          style={{ display: 'none' }}
          src="https://source.unsplash.com/user/erondu"
          alt="background"
        />
      }
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={6}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              Title of a longer featured blog post
           </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              Multiple lines of text that form the lede, informing new readers quickly and
              efficiently about what&apos;s most interesting in this post&apos;s contents.
           </Typography>
            <Link variant="subtitle1" to="/">
              Continue reading…
           </Link>
          </div>
        </Grid>
      </Grid>
    </Paper >

    <Grid container spacing={4} className={classes.cardGrid}>
      {featuredPosts.map(post => (
        <Grid item key={post.title} xs={12} md={6}>
          <CardActionArea component="a" href="#">
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Typography component="h2" variant="h5">
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {post.date}
                  </Typography>
                  <Typography variant="subtitle1" paragraph>
                    {post.description}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    Continue reading...
                 </Typography>
                </CardContent>
              </div>
              <Hidden xsDown>
                <CardMedia
                  className={classes.cardMedia}
                  image="https://source.unsplash.com/random"
                  title="Image title"
                />
              </Hidden>
            </Card>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
    {/* End sub featured posts */}
    <Grid container spacing={5} className={classes.mainGrid}>
      <div>
        <div className="ui clearing basic segment">
          <h1 className="ui header left floated">All Events</h1>
        </div>
        <div className="ui link cards">
          <div className="card blue">
            <Link to="/newEvent" className="new-event content center aligned">
              <i className="icon add massive"></i>
              <p>Create new event</p>
            </Link>
          </div>
          {[].concat(events).sort((a, b) => a.when.localeCompare(b.when)).map(renderEvent)}
        </div>
      </div>
    </Grid>
  </React.Fragment>
  );


}

export default Home;
