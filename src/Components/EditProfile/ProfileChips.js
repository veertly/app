import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    // padding: theme.spacing(0.5)
  },
  chip: {
    margin: theme.spacing(0.5, 1, 0.5, 0),
  },
}));

export default function ProfileChips(props) {
  const { chips, onDelete, showEmptyMsg, smallChips } = props;
  const classes = useStyles();

  const handleDelete = (chipToDelete) => () => {
    let newChips = chips.filter((chip) => chip.key !== chipToDelete.key);
    // console.log({ newChips });
    onDelete(newChips);
  };

  if (!chips) {
    return null;
  }
  return (
    <div className={classes.root}>
      {chips.map((data) => {
        return (
          <Chip
            size={smallChips ? "small" : "medium"}
            key={data.key}
            label={data.label.substring(0, 48)}
            onDelete={onDelete ? handleDelete(data) : undefined}
            className={classes.chip}
          />
        );
      })}

      {chips.length === 0 && showEmptyMsg && <Typography variant="caption">No {showEmptyMsg} set!</Typography>}
    </div>
  );
}
