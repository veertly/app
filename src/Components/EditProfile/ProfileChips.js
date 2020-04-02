import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
    // padding: theme.spacing(0.5)
  },
  chip: {
    margin: theme.spacing(0.5, 1, 0.5, 0)
  }
}));

export default function ProfileChips(props) {
  const { chips, setChips, showDelete, showEmptyMsg, smallChips } = props;
  const classes = useStyles();
  // const [chipData, setChipData] = React.useState([
  //   { key: 0, label: 'Angular' },
  //   { key: 1, label: 'jQuery' },
  //   { key: 2, label: 'Polymer' },
  //   { key: 3, label: 'React' },
  //   { key: 4, label: 'Vue.js' },
  // ]);
  console.log({ chips2: chips });

  const handleDelete = chipToDelete => () => {
    setChips(allChips => allChips.filter(chip => chip.key !== chipToDelete.key));
  };

  return (
    <div className={classes.root}>
      {chips.map(data => {
        return (
          <Chip
            size={smallChips ? "small" : "medium"}
            key={data.key}
            label={data.label}
            onDelete={showDelete ? handleDelete(data) : undefined}
            className={classes.chip}
          />
        );
      })}

      {chips.length === 0 && showEmptyMsg && <Typography variant="caption">No {showEmptyMsg} set!</Typography>}
    </div>
  );
}
