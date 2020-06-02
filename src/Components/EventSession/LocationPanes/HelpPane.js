import React from "react";
import { makeStyles, Typography, Button } from "@material-ui/core";
// import QnAImg from "../../../Assets/illustrations/qna.svg";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChatIcon from "@material-ui/icons/Chat";
import { useDispatch } from "react-redux";
import { openEditProfile, openFeedback } from "../../../Redux/dialogs";
import Link from "@material-ui/core/Link";
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
  },
  linksContainer: {
    textAlign: "center",
    padding: theme.spacing(4, 0)
  }
}));
const HelpPane = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChat = () => {
    // window.$crisp.push(["do", "chat:open"]);
    window.open(
      "https://go.crisp.chat/chat/embed/?website_id=e2d77fef-388b-4609-a944-238bdcc2fc70",
      "_blank"
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleChat}
          startIcon={<ChatIcon />}
        >
          Support Chat
        </Button>
      </div>
      <ExpansionPanel
        expanded={expanded === "camera_mic"}
        onChange={handleChange("camera_mic")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            <span role="img" aria-label="camera">
              📹
            </span>{" "}
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
        expanded={expanded === "browser_not_supported"}
        onChange={handleChange("browser_not_supported")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            <span role="img" aria-label="camera">
              🌐
            </span>{" "}
            My browser is not fully supported. What does that mean?{" "}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>
              Veertly works best by using a recent version of the Chrome
              browser.
            </Typography>
            <Typography>
              By using other browsers (e.g. Firefox, Safari) in their latest
              version it might also work well, but some functionalities might
              not be perfectly displayed.
            </Typography>
            <Typography>
              When using a browser that does not support WebRTC (e.g. Internet
              Explorer) or older versions of other browsers, your event
              experience will not be very smoothly.
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === "available_dnd"}
        onChange={handleChange("available_dnd")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            <span role="img" aria-label="camera">
              🧑
            </span>{" "}
            What does the 'Available / Do not disturb' switch on the top bar
            mean?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>
              When you indicate that you are 'available' and when you are not in
              a conversation, other attendees can start a video call with you
              and your avatar will appear in the 'Networking' section. If you
              are in the 'Do not disturb' mode, you will not be approached by
              anyone via video call.
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === "profile"}
        onChange={handleChange("profile")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            <span role="img" aria-label="camera">
              🧑‍🎨
            </span>{" "}
            How can I update my profile?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>
              Click on your avatar on the top-right of the screen and click '
              <Link
                component="button"
                onClick={() => {
                  dispatch(openEditProfile());
                }}
                // className={classes.link}
              >
                Edit profile
              </Link>
              '. <br />
              When having your profile updated, you are more likely to have more
              meaningful interactions with other attendees.
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel
        expanded={expanded === "mobile"}
        onChange={handleChange("mobile")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>
            <span role="img" aria-label="camera">
              📱
            </span>{" "}
            Can I join a Veertly event on my smartphone?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>
              We are working on improving your mobile experience. In order to
              give you a work-around in the meantime, we recommend to download
              the '
              <Link
                href="https://jitsi.org/downloads/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jitsi Meet
              </Link>
              ' app. When accessing Veertly on your mobile phone and entering
              the main stage or a conversation, you will be forwarded to your
              'Jitsi Meet' mobile app to join the video call.
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <div className={classes.linksContainer}>
        <Button
          color="secondary"
          display="block"
          onClick={() => dispatch(openFeedback())}
          style={{ display: "block", margin: "auto", marginBottom: 8 }}
        >
          Share your Feedback
        </Button>
        <a
          href="https://www.veertly.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.veertly.com
        </a>
      </div>
    </div>
  );
};

export default HelpPane;
