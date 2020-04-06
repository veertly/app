import React, { useEffect } from "react";
import { Button, TextField, Typography, Paper, Divider } from "@material-ui/core";
import { logout } from "../../Modules/userOperations";
import { useHistory } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from "moment";
import MUIRichTextEditor from "mui-rte";

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import Grid from "@material-ui/core/Grid";
import { getUrl } from "../../Modules/environments";
import { conferenceExists } from "../../Modules/eventsOperations";
import { createConference } from "../../Modules/eventSessionOperations";
import routes from "../../Config/routes";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ImageUploaderCrop from "../Images/ImageUploaderCrop";
import EventPage from "../EventShow/EventPage";

import { convertToRaw } from "draft-js";
import Dialog from "@material-ui/core/Dialog";
import { uploadEventBanner } from "../../Modules/storage";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0, 3, 0),
    [theme.breakpoints.up("sm")]: {
      margin: theme.spacing(6, 0),
    },
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: 16,
    // marginBottom: 16
  },
  button: {
    marginTop: theme.spacing(4),
  },
  bottom: {
    textAlign: "center",
  },
  stepperContainer: {
    width: "100%",
  },
  bannerContainer: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
  },
  previewText: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
    display: "block",
  },
}));

const sessionUrl = getUrl() + "/v/";

function EditEventSessionForm(props) {
  const classes = useStyles();
  const history = useHistory();

  const { user, isNewEvent, sessionId } = props;
  // const { register, handleSubmit, watch } = useForm(
  const [values, setValues] = React.useState({
    sessionId: sessionId !== undefined ? sessionId : "",
    title: "",
    conferenceRoomYoutubeVideoId: "",
    website: "",
    expectedAmountParticipants: "",
  });
  const selectedSessionId = values.sessionId;
  const [selectedVideoType, setSelectedVideoType] = React.useState("YOUTUBE");
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [sessionIdError, setSessionIdError] = React.useState(false);
  const [creatingEvent, setCreatingEvent] = React.useState(false);
  const [eventCreated, setEventCreated] = React.useState(false);

  const [activeStep, setActiveStep] = React.useState(0);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = React.useState(null);
  const [bannerImageBlob, setBannerImageBlob] = React.useState(null);
  const [eventDescription, setEventDescription] = React.useState(null);
  const [showPreview, setShowPreview] = React.useState(false);
  let [errors, setErrors] = React.useState({});

  let mounted = true;
  // let fetching = false;
  // let callbackUrl = location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";
  const handleUpdateField = (name) => (e) => {
    let value = e.target.value;
    let newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);

    if (name === "title" && value.trim() !== "") {
      setErrors({ ...errors, title: undefined });
    }
  };
  const handleVideoTypeChange = (event) => {
    setSelectedVideoType(event.target.value);
  };
  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleDescriptionUpdate = (editorState) => {
    setEventDescription(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };
  const handleCreateConference = async () => {
    console.log({ values });
    // let values = { ...data, conferenceVideoType: selectedVideoType, liveAt: selectedDate.unix() };
    // console.log({ values });
    setCreatingEvent(true);

    // upload image
    let path = await uploadEventBanner(values.sessionId, bannerImageBlob);
    console.log(path);
    try {
      await createConference(
        values.sessionId,
        user.uid,
        values.title,
        selectedVideoType,
        values.conferenceRoomYoutubeVideoId,
        values.website,
        values.expectedAmountParticipants,
        selectedDate.unix(),
        path,
        eventDescription
      );
      setEventCreated(true);
    } catch (e) {
      console.error(e);
      setEventCreated("ERROR");
    }
    setCreatingEvent(false);
  };

  useEffect(() => {
    const verifySessionId = async (id) => {
      console.log("Verifying " + id);
      let exists = await conferenceExists(id);
      console.log("Result (" + id + ")=" + exists);
      if (mounted) {
        if (exists && id === selectedSessionId) {
          setSessionIdError(true);
        } else if (!exists && id === selectedSessionId) {
          setSessionIdError(false);
        }
      }
    };
    if (selectedSessionId && selectedSessionId.trim() !== "") {
      verifySessionId(selectedSessionId.trim());
    }
  }, [selectedSessionId]);

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  const isAnonymous = user.isAnonymous;

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h4" color="primary" align="left">
          {isNewEvent && <span>Create new event</span>}
          {!isNewEvent && <span>Edit event</span>}
        </Typography>

        {isAnonymous && (
          <React.Fragment>
            <Typography variant="subtitle2" align="center" style={{ color: "#E74B54", marginTop: 16 }}>
              You are connected as a guest, if you want to create an event, please login using your email.
            </Typography>
            <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
              <Button
                variant="contained"
                color="primary"
                // className={classes.button}
                onClick={async () => {
                  await logout();
                  console.log(routes.CREATE_EVENT_SESSION());
                  history.push(routes.GO_TO_LOGIN(routes.CREATE_EVENT_SESSION()));
                }}
              >
                Login with email
              </Button>
            </div>
          </React.Fragment>
        )}
        <Typography variant="body1" display="block" style={{ marginTop: 16, marginBottom: 8 }}>
          Please complete this form to create your own virtual event. <br />
          As soon as your event has been created, you can share the dial-in link with your audience.
        </Typography>
        <div className={classes.stepperContainer}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Event Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Event Configuration</StepLabel>
            </Step>
          </Stepper>
        </div>

        <form>
          {/* {activeStep === 0 && ( */}
          <div style={{ display: activeStep === 0 ? "block" : "none" }}>
            <TextField
              fullWidth
              label="Event Title"
              name="title"
              variant="outlined"
              // inputRef={register({ required: true })}
              className={classes.textField}
              value={values.title}
              onChange={handleUpdateField("title")}
              required
              helperText={errors.title ? errors.title : "Title of your event"}
              error={errors.title !== undefined}
              disabled={isAnonymous}
            />
            <TextField
              fullWidth
              label="Official event website"
              name="website"
              variant="outlined"
              onChange={handleUpdateField("website")}
              className={classes.textField}
              value={values.website}
              helperText="Add the link to the official event website (if available) or the website of your organisation"
              disabled={isAnonymous}
            />

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid container justify="space-between" className={classes.textField}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Event date"
                  format="YYYY-MM-DD"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  autoOk
                  disablePast
                  inputVariant="outlined"
                  style={{ width: "48%" }}
                  disabled={isAnonymous}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Time"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  inputVariant="outlined"
                  style={{ width: "48%" }}
                  disabled={isAnonymous}
                />
              </Grid>
            </MuiPickersUtilsProvider>

            <div className={classes.bannerContainer}>
              <Divider style={{ margin: "24px 0" }} />
              <Typography color="textSecondary">Banner:</Typography>

              <ImageUploaderCrop
                aspectRatio={600 / 337}
                onPreviewUrlChange={setBannerImagePreviewUrl}
                onBlobChange={setBannerImageBlob}
              />
              {/* 600 / 232 */}

              <Typography color="textSecondary">Event description:</Typography>

              <MUIRichTextEditor
                label="Start typing..."
                controls={[
                  "title",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "link",
                  "media",
                  "numberList",
                  "bulletList",
                  "quote",
                  "code",
                  "clear",
                  // "undo",
                  // "redo",
                ]}
                onChange={handleDescriptionUpdate}
                inlineToolbar={true}
                maxLength={5000}
                value={eventDescription}
                inlineToolbarControls={[
                  "title",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "link",
                  "media",
                  "numberList",
                  "bulletList",
                  "quote",
                  "code",
                  "clear",
                ]}
              />
            </div>
          </div>
          <div style={{ display: activeStep === 1 ? "block" : "none" }}>
            <TextField
              fullWidth
              label="Expected amount of participants"
              name="expectedAmountParticipants"
              variant="outlined"
              type="number"
              className={classes.textField}
              onChange={handleUpdateField("expectedAmountParticipants")}
              value={values.expectedAmountParticipants}
              helperText="This value will not have a direct impact in the functionalities, but helps us to monitor and follow closely each event"
              disabled={isAnonymous}
            />
            <TextField
              fullWidth
              label="Event URL"
              name="sessionId"
              variant="outlined"
              className={classes.textField}
              onChange={handleUpdateField("sessionId")}
              value={values.sessionId}
              helperText={
                !sessionIdError
                  ? "This will be the url to your live event, it should not contain any space and once created it cannot be changed"
                  : "This URL is already in use, please select a new one"
              }
              required
              error={sessionIdError}
              InputProps={{
                startAdornment: <InputAdornment position="start">{sessionUrl}</InputAdornment>,
              }}
              disabled={isAnonymous}
            />
            <FormControl component="fieldset" className={classes.textField} disabled={isAnonymous}>
              <FormLabel component="legend">Conference Room Type</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="videoType"
                value={selectedVideoType}
                onChange={handleVideoTypeChange}
              >
                <FormControlLabel
                  value="YOUTUBE"
                  control={<Radio color="primary" />}
                  label="Youtube live stream (recommended)"
                />
                <FormControlLabel value="JITSI" control={<Radio color="primary" />} label="Jitsi video conference" />
              </RadioGroup>
              {selectedVideoType === "JITSI" && (
                <FormHelperText>We do not recommend Jitsi video conference for a big audience</FormHelperText>
              )}
            </FormControl>
            {selectedVideoType === "YOUTUBE" && (
              <TextField
                fullWidth
                label="Youtube livestream video id"
                name="conferenceRoomYoutubeVideoId"
                variant="outlined"
                onChange={handleUpdateField("conferenceRoomYoutubeVideoId")}
                required={selectedVideoType === "YOUTUBE"}
                className={classes.textField}
                value={values.conferenceRoomYoutubeVideoId}
                helperText="The video id can be found on the youtube link of your livestream: https://www.youtube.com/watch?v=<VIDEO_ID>"
                disabled={isAnonymous}
              />
            )}
          </div>
          <div className={classes.bottom}>
            {activeStep === 0 && (
              <div style={{ textAlign: "right" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={() => setShowPreview(!showPreview)}
                  style={{ marginRight: 16 }}
                >
                  {!showPreview ? "Show Preview" : "Hide Preview"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    if (values.title.trim() === "") {
                      setErrors({ title: "Title can't be empty" });
                    } else {
                      setActiveStep(1);
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            )}
            {activeStep === 1 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={() => setActiveStep(0)}
                  >
                    Previous
                  </Button>
                  {!creatingEvent && eventCreated !== true && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateConference}
                      className={classes.button}
                      disabled={isAnonymous}
                    >
                      Create Event
                    </Button>
                  )}
                </div>
                {creatingEvent && (
                  <Typography variant="caption" align="center" display="block">
                    Creating event...
                  </Typography>
                )}
                {eventCreated === true && (
                  <React.Fragment>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      display="block"
                      style={{ color: "#53a653", marginTop: 16 }}
                    >
                      Event created successfully!
                    </Typography>
                    <Typography variant="caption" align="center" display="block">
                      You can share your event url that will be available at the time of the event:{" "}
                      <a href={sessionUrl + values.sessionId}>{sessionUrl + values.sessionId}</a>
                    </Typography>
                  </React.Fragment>
                )}
                {eventCreated === "ERROR" && (
                  <React.Fragment>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      display="block"
                      style={{ color: "#E74B54", marginTop: 16 }}
                    >
                      An error occured while creating the event...
                    </Typography>
                    <Typography variant="caption" align="center" display="block">
                      Please contact veertly team if the error persists
                      <br />
                      <a href="mailto:info@veertly.com">info@veertly.com</a>
                    </Typography>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </form>
      </Paper>

      {/* {showPreview && ( */}
      {/* // <div style={{ width: "100%", marginBottom: 48 }}>
        //   <Typography variant="overline" gutterBottom className={classes.previewText}>
        //     Preview event page
        //   </Typography> */}
      <Dialog onClose={() => setShowPreview(false)} open={showPreview} scroll={"body"}>
        <EventPage
          event={{
            bannerUrl: bannerImagePreviewUrl,
            title: values.title,
            description: eventDescription,
            liveAt: selectedDate,
            website: values.website,
          }}
        />
      </Dialog>
      {/* </div> */}
      {/* )} */}
    </React.Fragment>
  );
}

export default EditEventSessionForm;
