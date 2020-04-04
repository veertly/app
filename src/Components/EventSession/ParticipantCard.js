import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import LinkedinIcon from "../../Assets/Icons/Linkedin";
import TwitterIcon from "../../Assets/Icons/Twitter";
import ProfileChips from "../EditProfile/ProfileChips";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

const useStyles = makeStyles(theme => ({
  headlineContainer: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    padding: theme.spacing(1),
    display: "flex"
  },
  headlineContainerNoMargins: {
    display: "flex"
  },
  participantDetails: {
    flexGrow: 1,
    marginLeft: theme.spacing(2)
  },
  topicsInterested: {
    // textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    display: "block",
    maxWidth: 400
    // width: 185
  },
  avatar: {
    marginTop: 1,
    width: 80,
    height: 80,
    fontSize: "2.5rem"
  },
  participantName: {
    display: "flex"
  },
  socialNetworkIcon: {
    marginTop: 3,
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main,
      cursor: "pointer"
    }
  },
  companyTitle: {
    margin: theme.spacing(0.5, 2)
  }
}));

export default function(props) {
  const classes = useStyles();

  const { participant, noMargins } = props;

  if (!participant) {
    return null;
  }

  return (
    <div className={noMargins === false ? classes.headlineContainer : classes.headlineContainerNoMargins}>
      {participant.avatarUrl && (
        <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
      )}
      {!participant.avatarUrl && participant.firstName.trim() !== "" && (
        <Avatar className={classes.avatar}>
          {participant.firstName.charAt(0)}
          {participant.lastName.charAt(0)}
        </Avatar>
      )}
      {!participant.avatarUrl && participant.firstName.trim() === "" && <Avatar className={classes.avatar}>G</Avatar>}
      <div className={classes.participantDetails}>
        <div className={classes.participantName}>
          <Typography variant="h6">
            {participant.firstName.trim() === "" ? "Guest User" : `${participant.firstName} ${participant.lastName}`}
          </Typography>

          {participant.linkedinUrl && (
            <a href={participant.linkedinUrl} target="_blank">
              <LinkedinIcon className={classes.socialNetworkIcon} />
            </a>
          )}
          {participant.twitterUrl && (
            <a href={participant.twitterUrl} target="_blank">
              <TwitterIcon className={classes.socialNetworkIcon} />
            </a>
          )}
          {participant.emailPublic && participant.email.trim() !== "" && (
            <a href={`mailto:${participant.email}`} target="_blank">
              <MailOutlineIcon className={classes.socialNetworkIcon} />
            </a>
          )}
        </div>

        {(participant.company || participant.companyTitle) && (
          <Typography color="textSecondary" /* className={classes.companyTitle} */ className={classes.topicsInterested}>
            {`${participant.companyTitle}${
              participant.company.trim() !== "" && participant.companyTitle.trim() !== "" ? " @ " : ""
            }${participant.company}`}
          </Typography>
        )}

        <ProfileChips chips={participant.interestsChips} showDelete={false} smallChips={true} />
      </div>
    </div>
  );
}
