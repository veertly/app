import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function (props) {
  const classes = useStyles();

  const { participant, ...rest } = props;

  if (!participant) {
    return null;
  }

  if (participant.avatarUrl) {
    return (
      <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
        <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} {...rest} />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`${participant.firstName} ${participant.lastName}`}>
      <Avatar className={classes.avatar} {...rest}>
        {participant.firstName.charAt(0)}
        {participant.lastName.charAt(0)}
      </Avatar>
    </Tooltip>
  );
}
