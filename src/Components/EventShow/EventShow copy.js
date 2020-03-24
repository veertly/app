import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography, Button, Avatar, Grid, Paper, Divider } from '@material-ui/core';
import moment from "moment";
import TitledPaper from '../Core/TitledPaper'
import PaddedPaper from '../Core/PaddedPaper';
import { registerToEvent } from '../../Modules/eventsOperations'
import {
  FacebookShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
} from 'react-share';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  PocketShareButton,
  InstapaperShareButton,
  EmailShareButton,
} from 'react-share';

import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  RedditIcon,
  TumblrIcon,
  LivejournalIcon,
  MailruIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  EmailIcon,
} from 'react-share';


const styles = theme => ({
  avatar: {
    marginTop: 1,
    width: 80,
    height: 80
  },
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(14),
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    minWidth: 200,
    justifyContent: 'center',
    textAlign: 'center'
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundImage: `url(${"https://images.unsplash.com/photo-1560264401-b76ed96f3134?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"})`,
    opacity: 0.3,
    zIndex: -1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
  },
  arrowDown: {
    position: 'absolute',
    bottom: theme.spacing(4),
  },
  joinButtonWrapper: {
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  '@media (min-width: 960px)': {
    rightColumn: {
      marginLeft: '0.75rem'
    }
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
  rightColumn: {
    marginTop: theme.spacing(3),
    boxShadow: 'none',
    margin: '1rem 0 0'
  },
  header: {
    width: "100%",
  },
  row: {
    flex: "1",
    flexDirection: 'row'
  }
});


function EventShow (props) {
  const { backgroundClassName, children, classes, event, eventId, user } = props;

  function handleRegisterToEvent () {
    registerToEvent(eventId, user.uid);
  }

  function hasJoined () {
    if (event.participants !== undefined && user !== null) {
      return event.participants[user.uid] !== null;
    }
  }

  return <section>
    <PaddedPaper className={classes.header}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Typography variant="h4">{event.title}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>Share on social media</Typography>
          <div className={classes.row}>
            <FacebookShareButton url={window.location.href} ><FacebookIcon size={32} round={true} /></FacebookShareButton>
            <TwitterShareButton url={window.location.href} ><TwitterIcon size={32} round={true} /></TwitterShareButton>
          </div>
        </Grid>
      </Grid>
    </PaddedPaper>
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <PaddedPaper className={classes.container}>
          <img height="200" width="400" src={event.imageUrl} />
          <Typography variant="h4">What we'll do</Typography>
          <Typography>{event.description}</Typography>
        </PaddedPaper>
      </Grid>
      <Grid item xs={3} className={[classes.rightColumn]}>
        <TitledPaper title="Join">
          <div className={classes.joinButtonWrapper}>
            {hasJoined() ? <Typography>You already joined!</Typography> : <Button
              onClick={() => handleRegisterToEvent()}
              className={classes.button}
              variant="contained"
              color="secondary"
              size="small"
            >
              JOIN THIS MEETUP
        </Button>}
          </div>
        </TitledPaper>
        <TitledPaper title="When" paddedPaperClassName={classes.marginTop}>
          <p><i className="icon calendar"></i>{moment.unix(event.startTimestamp).format('LL')}</p>
          <p><i className="icon info"></i>{moment.unix(event.startTimestamp).format('h:mm A')}</p>
        </TitledPaper>
      </Grid>
    </Grid>
  </section >
}

export default withStyles(styles)(EventShow);

