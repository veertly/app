import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip, withStyles } from "@material-ui/core";
import ParticipantCard from "../EventSession/ParticipantCard";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    border: "1px solid #F4F6F8",
    marginLeft: 3,
    marginRight: 3
  }
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 600,
    minWidth: 250,
    width: "100%",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    padding: theme.spacing(2)
  }
}))(Tooltip);

export default function (props) {
  const classes = useStyles();

  const { participant, ...rest } = props;

  if (!participant) {
    return null;
  }

  if (participant.avatarUrl) {
    return (
      <HtmlTooltip
        title={
          <React.Fragment>
            <ParticipantCard participant={participant} />
          </React.Fragment>
        }
        interactive
      >
        <Avatar
          alt={participant.firstName}
          src={participant.avatarUrl}
          className={classes.avatar}
          {...rest}
        />
      </HtmlTooltip>
    );
  }

  return (
    <HtmlTooltip
      title={
        <div className={classes.tooltip}>
          <ParticipantCard participant={participant} />
        </div>
      }
      interactive
    >
      <Avatar className={classes.avatar} {...rest}>
        {participant.firstName.charAt(0)}
        {participant.lastName.charAt(0)}
      </Avatar>
    </HtmlTooltip>
  );
}
