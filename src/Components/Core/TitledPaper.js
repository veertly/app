import { withStyles } from "@material-ui/core/styles";
import React from "react";
import PaddedPaper from "./PaddedPaper";

const titleBase = {
  fontSize: "135%",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  marginTop: 0,
  textTransform: "uppercase",
  textAlign: "center",
  "@media(min-width: 55.5rem)": {
    textAlign: "unset"
  }
};

const styles = theme => ({
  textCenter: {
    textAlign: "center"
  },
  title: {
    ...titleBase,
    color: "white !important"
  },
  titleBlack: {
    ...titleBase,
    color: "black !important"
  },
  marginTop: {
    marginTop: "4rem"
  },
  paddedPaper: {
    padding: "2rem 1rem",
    "@media(min-width: 35.5rem)": {
      padding: "2rem"
    }
  }
});

const TitledPaper = props => {
  const { classes, children, title, paddedPaperClassName } = props;

  return (
    <div>
      <PaddedPaper className={`${paddedPaperClassName} classes.marginTop, classes.paddedPaper`}>
        {title ? (
          <div className={classes.textCenter}>
            <h2 className={classes.titleBlack}>{title}</h2>
          </div>
        ) : (
          <div></div>
        )}
        {children}
      </PaddedPaper>
    </div>
  );
};

export default withStyles(styles)(TitledPaper);
