import React from "react";
import { makeStyles, Typography, Button } from "@material-ui/core";
// import QnAImg from "../../../Assets/illustrations/qna.svg";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChatIcon from "@material-ui/icons/Chat";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
    // flexBasis: "33.33%",
    // flexShrink: 0
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    position: "sticky",
    top: -8,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: "#fff",
    zIndex: 2
  }
}));
const HelpPane = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => alert("under construction")}
          startIcon={<ChatIcon />}
        >
          Support Chat
        </Button>
      </div>
      <ExpansionPanel
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            My camera and microphone are not working
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>
              Please make sure you have granted Veertly permission to access
              your camera and microphone:
            </Typography>
            <ol>
              <li>
                Allow Veertly to access your camera and microphone when prompted
              </li>
              <li>
                If you blocked the access to the camera and microphone for any
                reason, you can enable it again by clicking on the camera icon
                or on the right side of the URL address bar or on the lock on
                the left side of your URL bar
              </li>
              <li>
                After clicking done, you need to refresh your page and initiate
                the conversation again
              </li>
            </ol>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Users</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Advanced settings</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Personal data</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default HelpPane;
