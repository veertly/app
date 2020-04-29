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
// import useScript from "../../Hooks/useScript";

import Grid from "@material-ui/core/Grid";
import { getUrl } from "../../Modules/environments";
import { conferenceExists } from "../../Modules/eventsOperations";
import { createConference } from "../../Modules/eventSessionOperations";
import routes from "../../Config/routes";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ImageUploaderCrop from "../Images/ImageUploaderCrop";
import EventPage from "./EventPage";

import { convertToRaw } from "draft-js";
import Dialog from "@material-ui/core/Dialog";
import { uploadEventBanner } from "../../Modules/storage";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import { parseURL } from "../../Utils/parser";
import SuccessIcon from "@material-ui/icons/CheckCircleOutline";
import FailIcon from "@material-ui/icons/Cancel";
import { DEFAULT_EVENT_OPEN_MINUTES, DEFAULT_EVENT_CLOSES_MINUTES } from "../../Config/constants";
import { getTimestampFromDate } from "../../Modules/firebaseApp";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "@material-ui/icons/FileCopy";
import IconButton from "@material-ui/core/IconButton";
import { useSnackbar } from "material-ui-snackbar-provider";
import useIsMounted from "react-is-mounted-hook";
import EventShareIcons from "./EventShareIcons";

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
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  shareButton: {
    margin: theme.spacing(1),
  },
}));

const sessionUrl = getUrl() + "/v/";

const getYoutubeUrl = (eventSession) => {
  return eventSession
    ? eventSession.conferenceRoomYoutubeVideoId && eventSession.conferenceRoomYoutubeVideoId.trim() !== ""
      ? "https://www.youtube.com/watch?v=" + eventSession.conferenceRoomYoutubeVideoId
      : null
    : null;
};

const getFacebookUrl = (eventSession) => {
  return eventSession
    ? eventSession.conferenceRoomFacebookVideoId && eventSession.conferenceRoomFacebookVideoId.trim() !== ""
      ? "https://www.facebook.com/facebook/videos/" + eventSession.conferenceRoomFacebookVideoId
      : null
    : null;
};
const getVideoId = (link) => {
  let parsedUrl = parseURL(link);
  return parsedUrl.searchObject.v;
};
const getFacebookVideoId = (link) => {
  let parsedUrl = parseURL(link);
  let pathname = parsedUrl.pathname.split("/");
  let videosIndex = pathname.findIndex((v) => v === "videos");
  let videoId = pathname[videosIndex + 1];
  return videoId;
};

function EditEventSessionForm(props) {
  const classes = useStyles();
  const history = useHistory();

  const { userId, isAnonymous, eventSession } = props;

  const isNewEvent = eventSession === undefined;
  // const { register, handleSubmit, watch } = useForm(
  const [values, setValues] = React.useState({
    sessionId: !isNewEvent && eventSession.id ? eventSession.id : "",
    title: !isNewEvent && eventSession.title ? eventSession.title : "",
    conferenceRoomYoutubeLink: !isNewEvent ? getYoutubeUrl(eventSession) : "",
    conferenceRoomYoutubeVideoId:
      !isNewEvent && eventSession.conferenceRoomYoutubeVideoId ? eventSession.conferenceRoomYoutubeVideoId : "",

    conferenceRoomFacebookLink: !isNewEvent ? getFacebookUrl(eventSession) : "",
    conferenceRoomFacebookVideoId:
      !isNewEvent && eventSession.conferenceRoomFacebookVideoId ? eventSession.conferenceRoomFacebookVideoId : "",
    website: !isNewEvent && eventSession.website ? eventSession.website : "",
    expectedAmountParticipants:
      !isNewEvent && eventSession.expectedAmountParticipants ? eventSession.expectedAmountParticipants : "",
    eventOpens: !isNewEvent && eventSession.eventOpens ? eventSession.eventOpens : DEFAULT_EVENT_OPEN_MINUTES,
    eventCloses: !isNewEvent && eventSession.eventCloses ? eventSession.eventCloses : DEFAULT_EVENT_CLOSES_MINUTES,
    visibility: !isNewEvent && eventSession.visibility ? eventSession.visibility : "LISTED",
  });

  const selectedSessionId = values.sessionId;
  const [selectedVideoType, setSelectedVideoType] = React.useState(
    !isNewEvent ? eventSession.conferenceVideoType : "YOUTUBE"
  );
  const [selectedDate, setSelectedDate] = React.useState({
    begin: !isNewEvent && eventSession.eventBeginDate ? moment(eventSession.eventBeginDate.toDate()) : moment(),
    end:
      !isNewEvent && eventSession.eventEndDate ? moment(eventSession.eventEndDate.toDate()) : moment().add(2, "hours"),
  });
  const [creatingEvent, setCreatingEvent] = React.useState(false);
  const [eventCreated, setEventCreated] = React.useState(false);
  const [sessionIdError, setSessionIdError] = React.useState(undefined);
  const [activeStep, setActiveStep] = React.useState(0);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = React.useState(
    !isNewEvent ? (eventSession.bannerUrl ? eventSession.bannerUrl : null) : null
  );
  const [bannerImageBlob, setBannerImageBlob] = React.useState(null);
  const [eventDescription, setEventDescription] = React.useState(
    !isNewEvent ? (eventSession.description ? eventSession.description : null) : null
  );
  const [showPreview, setShowPreview] = React.useState(false);
  const [showYoutubePreview, setShowYoutubePreview] = React.useState(false);
  const [showFacebookPreview, setShowFacebookPreview] = React.useState(false);
  const [showEventCreatedDialog, setShowEventCreatedDialog] = React.useState(false);
  const [bannerChanged, setBannerChanged] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const snackbar = useSnackbar();
  const mounted = useIsMounted();
  // useScript(
  //   "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"
  // );
  useEffect(() => {
    let fetchBlob = async () => {
      if (bannerImageBlob === null && eventSession && eventSession.bannerUrl) {
        let blob = await fetch(eventSession.bannerUrl).then((r) => r.blob());
        setBannerImageBlob(blob);
      }
    };
    fetchBlob();
  }, [bannerImageBlob, eventSession]);

  const shareText = React.useMemo(
    () => `Join me in the virtual event ${values.title} at ${selectedDate.begin.format("lll")} on @veertly `,
    [values.title, selectedDate.begin]
  );

  const handleUpdateField = (name) => (e) => {
    let value = e.target.value;
    let newValues = { ...values };
    newValues[name] = value;

    if (name === "conferenceRoomYoutubeLink" && value.trim() !== "") {
      newValues.conferenceRoomYoutubeVideoId = getVideoId(value);
    }

    if (name === "conferenceRoomFacebookLink" && value.trim() !== "") {
      newValues.conferenceRoomFacebookVideoId = getFacebookVideoId(value);
    }
    setValues(newValues);

    let newErrors = { ...errors };
    if (name === "title" && value.trim() !== "") {
      newErrors.title = undefined;
    }

    if (name === "sessionId" && value.trim() !== "") {
      if (/^([a-zA-Z0-9-])+$/.test(value) === false) {
        newErrors.sessionId = "Event URL not valid (only letters, numbers or the characters '-' and '_' are allowed)";
      } else {
        newErrors.sessionId = undefined;
      }
    }

    if (name === "conferenceRoomYoutubeLink" && value.trim() !== "" && newValues.conferenceRoomYoutubeVideoId) {
      newErrors.conferenceRoomYoutubeLink = undefined;
    }

    if (name === "conferenceRoomFacebookLink" && value.trim() !== "" && newValues.conferenceRoomFacebookVideoId) {
      newErrors.conferenceRoomFacebookLink = undefined;
    }

    setErrors(newErrors);
  };
  const handleVideoTypeChange = (event) => {
    setSelectedVideoType(event.target.value);
  };
  const handleDateChange = (name) => (date) => {
    let newDates = { ...selectedDate };
    newDates[name] = date;
    let begin = name === "begin" ? date : selectedDate.begin;
    let end = name === "end" ? date : selectedDate.end;

    if (!begin.isBefore(moment().subtract(60, "minutes"))) {
      setErrors({ ...errors, beginDate: undefined });
    }

    if (!end.isBefore(begin)) {
      setErrors({ ...errors, endDate: undefined });
    }
    if (end.isBefore(begin)) {
      newDates.end = moment(begin).add(2, "hours");
    }
    setSelectedDate(newDates);
  };

  const handleDescriptionUpdate = (editorState) => {
    setEventDescription(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };

  const moveToConfigurationPage = () => {
    let foundErrors = false;

    if (values.title.trim() === "") {
      setErrors({ ...errors, title: "Title can't be empty" });
      foundErrors = true;
    }

    if (isNewEvent && selectedDate.begin.isBefore(moment().subtract(60, "minutes"))) {
      setErrors({ ...errors, beginDate: "Begin date of the event can't be in the past" });
      foundErrors = true;
    }

    if (selectedDate.end.isBefore(selectedDate.begin)) {
      setErrors({ ...errors, endDate: "End date of the event can't be before the begin" });
      foundErrors = true;
    }

    if (!foundErrors) {
      setActiveStep(1);
    }
  };

  const handleEventVisibility = (event) => {
    setValues({ ...values, visibility: event.target.checked ? "LISTED" : "UNLISTED" });
  };

  const handleCreateConference = async () => {
    let foundErrors = false;
    let newErrors = { ...errors };
    if (values.sessionId.trim() === "") {
      newErrors.sessionId = "Event URL can't be empty";
      foundErrors = true;
    }

    if (selectedVideoType === "YOUTUBE" && !values.conferenceRoomYoutubeVideoId) {
      newErrors.conferenceRoomYoutubeLink = "Couldn't retrieve the correct video id from your youtube link";
      foundErrors = true;
    }
    if (selectedVideoType === "YOUTUBE" && values.conferenceRoomYoutubeLink.trim() === "") {
      newErrors.conferenceRoomYoutubeLink = "Youtube URL can't be empty";
      foundErrors = true;
    }

    if (selectedVideoType === "FACEBOOK" && !values.conferenceRoomFacebookVideoId) {
      newErrors.conferenceRoomYoutubeLink = "Couldn't retrieve the correct video id from your facebook link";
      foundErrors = true;
    }
    if (selectedVideoType === "FACEBOOK" && values.conferenceRoomFacebookLink.trim() === "") {
      newErrors.conferenceRoomFacebookLink = "Facebook URL can't be empty";
      foundErrors = true;
    }

    if (foundErrors) {
      setErrors(newErrors);
      return;
    }
    setCreatingEvent(true);

    // upload image
    let uploadedBanner =
      bannerImageBlob && bannerChanged ? await uploadEventBanner(values.sessionId, bannerImageBlob, userId) : null;
    try {
      await createConference(
        isNewEvent,
        values.sessionId,
        userId,
        values.title,
        selectedVideoType,
        values.conferenceRoomYoutubeVideoId,
        values.conferenceRoomFacebookVideoId,
        values.website,
        values.expectedAmountParticipants,
        selectedDate.begin.toDate(),
        selectedDate.end.toDate(),
        uploadedBanner ? uploadedBanner.path : null,
        uploadedBanner ? uploadedBanner.url : null,
        eventDescription,
        values.visibility,
        values.eventOpens,
        values.eventCloses
      );
      setEventCreated(true);
    } catch (e) {
      console.error(e);
      setEventCreated("ERROR");
    }
    setShowEventCreatedDialog(true);
    setCreatingEvent(false);
  };

  useEffect(() => {
    const verifySessionId = async (id) => {
      let exists = await conferenceExists(id);
      if (mounted) {
        if (eventSession && eventSession.id === selectedSessionId) {
          setSessionIdError(undefined);
        } else if (exists && id === selectedSessionId) {
          setSessionIdError("This URL is already in use, please select a new one");
        } else if (!exists && id === selectedSessionId) {
          setSessionIdError(undefined);
        }
      }
    };
    if (selectedSessionId && selectedSessionId.trim() !== "") {
      verifySessionId(selectedSessionId.trim());
    }
  }, [selectedSessionId, eventSession, mounted]);

  // console.log(eventSession);
  // console.log(selectedDate);

  return (
    <React.Fragment>
      {/* <Paper className={classes.root}> */}
      <Typography variant="h4" color="primary" align="left">
        {isNewEvent && <span>Create new event</span>}
        {!isNewEvent && <span>Edit event</span>}
      </Typography>
      {isNewEvent && (
        <Typography variant="body1" display="block" style={{ marginTop: 16, marginBottom: 8 }}>
          Please complete this form to create your own virtual event. <br />
          As soon as your event has been created, you can share the dial-in link with your audience.
        </Typography>
      )}
      {isAnonymous && (
        <React.Fragment>
          <Typography variant="subtitle2" align="center" style={{ color: "#E74B54", marginTop: 16 }}>
            You are connected as a guest, if you want to create an event, please login using your email or Google
            account.
          </Typography>
          <div style={{ width: "100%", textAlign: "center", marginTop: 16 }}>
            <Button
              variant="contained"
              color="primary"
              // className={classes.button}
              onClick={async () => {
                await logout();
                history.push(routes.GO_TO_LOGIN(routes.CREATE_EVENT_SESSION()));
              }}
            >
              Login with email
            </Button>
          </div>
        </React.Fragment>
      )}
      {!isAnonymous && (
        <React.Fragment>
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
                    label="Event begin date"
                    format="YYYY-MM-DD"
                    value={selectedDate.begin}
                    onChange={handleDateChange("begin")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    autoOk
                    disablePast
                    inputVariant="outlined"
                    style={{ width: "48%" }}
                    disabled={isAnonymous}
                    error={errors.beginDate !== undefined}
                    helperText={errors.beginDate !== undefined ? errors.beginDate : null}
                  />
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Time"
                    value={selectedDate.begin}
                    onChange={handleDateChange("begin")}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                    inputVariant="outlined"
                    style={{ width: "48%" }}
                    disabled={isAnonymous}
                    error={errors.beginDate !== undefined}
                    helperText={errors.beginDate !== undefined ? errors.beginDate : null}
                  />
                  {/* <TextField
                    id="time"
                    label="Alarm clock"
                    type="time"
                    defaultValue="07:30"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    onChange={(time) => {
                      console.log(time);
                      debugger;
                    }}
                    value={selectedDate.begin.format()}
                  /> */}
                </Grid>

                <Grid container justify="space-between" className={classes.textField}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Event end date"
                    format="YYYY-MM-DD"
                    value={selectedDate.end}
                    onChange={handleDateChange("end")}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    autoOk
                    disablePast
                    inputVariant="outlined"
                    style={{ width: "48%" }}
                    disabled={isAnonymous}
                    error={errors.endDate !== undefined}
                    helperText={errors.endDate !== undefined ? errors.endDate : null}
                  />
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Time"
                    value={selectedDate.end}
                    onChange={handleDateChange("end")}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                    inputVariant="outlined"
                    style={{ width: "48%" }}
                    disabled={isAnonymous}
                    error={errors.endDate !== undefined}
                    helperText={errors.endDate !== undefined ? errors.endDate : null}
                  />
                </Grid>
              </MuiPickersUtilsProvider>

              <div className={classes.bannerContainer}>
                <Divider style={{ margin: "24px 0" }} />
                <FormLabel component="legend" className={classes.textField}>
                  Banner
                </FormLabel>
                <FormHelperText>Recommended size 600 x 337 pixels</FormHelperText>

                <ImageUploaderCrop
                  aspectRatio={600 / 337}
                  onPreviewUrlChange={(url) => {
                    setBannerChanged(true);
                    setBannerImagePreviewUrl(url);
                  }}
                  onBlobChange={setBannerImageBlob}
                  initialImageBlob={bannerImageBlob}
                />
                {/* 600 / 232 */}

                <FormLabel component="legend" className={classes.textField}>
                  Event description:
                </FormLabel>
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
                  value={!isNewEvent && eventSession ? eventSession.description : null}
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
              <Grid container justify="space-between" className={classes.textField}>
                <div style={{ flexGrow: 1, marginRight: 16 }}>
                  <TextField
                    fullWidth
                    label="Event URL"
                    name="sessionId"
                    variant="outlined"
                    className={classes.textField}
                    onChange={handleUpdateField("sessionId")}
                    value={values.sessionId}
                    helperText={
                      errors.sessionId
                        ? errors.sessionId
                        : sessionIdError
                        ? sessionIdError
                        : "This will be the url to your live event, it should not contain any space and once created it cannot be changed"
                    }
                    error={errors.sessionId !== undefined || sessionIdError !== undefined}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{sessionUrl}</InputAdornment>,
                    }}
                    disabled={!isNewEvent}
                  />
                </div>
                <div>
                  <FormLabel component="legend" className={classes.textField}>
                    Event visibility
                  </FormLabel>
                  <FormGroup row>
                    <Tooltip
                      title={
                        values.visibility === "LISTED"
                          ? "Your event will be listed on our platform"
                          : "Your event will not be listed on our platform"
                      }
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.visibility === "LISTED"}
                            onChange={handleEventVisibility}
                            name="visibility"
                            color="primary"
                          />
                        }
                        label={values.visibility === "LISTED" ? "Listed" : "Unlisted"}
                      />
                    </Tooltip>
                  </FormGroup>
                </div>
              </Grid>
              <FormControl
                component="fieldset"
                className={classes.textField}
                disabled={isAnonymous}
                style={{ marginLeft: 8 }}
              >
                <FormLabel component="legend">Conference Room Type</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="videoType"
                  value={selectedVideoType}
                  onChange={handleVideoTypeChange}
                >
                  <FormControlLabel value="YOUTUBE" control={<Radio color="primary" />} label="Youtube live stream" />

                  <FormControlLabel value="FACEBOOK" control={<Radio color="primary" />} label="Facebook live stream" />
                  <FormControlLabel value="JITSI" control={<Radio color="primary" />} label="Jitsi video conference" />
                </RadioGroup>
                {selectedVideoType === "JITSI" && (
                  <FormHelperText>We do not recommend Jitsi video conference for a big audience</FormHelperText>
                )}
              </FormControl>

              {selectedVideoType === "YOUTUBE" && (
                <Grid container justify="space-between" className={classes.textField}>
                  <div style={{ flexGrow: 1, marginRight: 16 }}>
                    <TextField
                      fullWidth
                      label="Youtube livestream video URL"
                      name="conferenceRoomYoutubeLink"
                      variant="outlined"
                      onChange={handleUpdateField("conferenceRoomYoutubeLink")}
                      required={selectedVideoType === "YOUTUBE"}
                      value={values.conferenceRoomYoutubeLink}
                      // helperText="This is the link to the youtube livestream video"
                      disabled={isAnonymous}
                      error={errors.conferenceRoomYoutubeLink !== undefined}
                      helperText={
                        errors.conferenceRoomYoutubeLink !== undefined ? errors.conferenceRoomYoutubeLink : null
                      }
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setShowYoutubePreview(true)}
                      // width={150}
                    >
                      Preview
                    </Button>
                  </div>
                </Grid>
              )}

              {selectedVideoType === "FACEBOOK" && (
                <Grid container justify="space-between" className={classes.textField}>
                  <div style={{ flexGrow: 1, marginRight: 16 }}>
                    <TextField
                      fullWidth
                      label="Facebook livestream video URL"
                      name="conferenceRoomFacebookLink"
                      variant="outlined"
                      onChange={handleUpdateField("conferenceRoomFacebookLink")}
                      required={selectedVideoType === "FACEBOOK"}
                      value={values.conferenceRoomFacebookLink}
                      disabled={isAnonymous}
                      error={errors.conferenceRoomFacebookLink !== undefined}
                      helperText={
                        errors.conferenceRoomFacebookLink !== undefined ? errors.conferenceRoomFacebookLink : null
                      }
                    />
                  </div>
                  {/* <div style={{ marginTop: 8 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setShowFacebookPreview(true)}
                      // width={150}
                    >
                      Preview
                    </Button>
                  </div> */}
                </Grid>
              )}
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

              <Grid container justify="space-between" className={classes.textField}>
                <TextField
                  fullWidth
                  label="Event opens"
                  name="eventOpens"
                  variant="outlined"
                  onChange={handleUpdateField("eventOpens")}
                  value={values.eventOpens}
                  type="number"
                  helperText="Your attendees can start entering the event the indicated minutes before the official begin date of the event"
                  disabled={isAnonymous}
                  style={{ width: "48%" }}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">minutes before</InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Event closes"
                  name="eventCloses"
                  variant="outlined"
                  onChange={handleUpdateField("eventCloses")}
                  value={values.eventCloses}
                  type="number"
                  helperText="Your attendees will only be able to keep connected up to the indicated amount of minutes after the official end date of the event"
                  disabled={isAnonymous}
                  style={{ width: "48%" }}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">minutes after</InputAdornment>,
                  }}
                />
              </Grid>
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
                    onClick={moveToConfigurationPage}
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
                      disabled={creatingEvent === true}
                    >
                      Previous
                    </Button>
                    {!creatingEvent && eventCreated !== true && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCreateConference}
                        className={classes.button}
                        disabled={isAnonymous}
                      >
                        {isNewEvent ? "Create Event" : "Save Event"}
                      </Button>
                    )}
                  </div>
                  {creatingEvent && (
                    <Typography variant="caption" align="center" display="block">
                      {isNewEvent ? "Creating" : "Updating"} event...
                    </Typography>
                  )}
                </div>
              )}
            </div>
          </form>
        </React.Fragment>
      )}
      {/* </Paper> */}

      <Dialog onClose={() => setShowPreview(false)} open={showPreview} scroll={"body"}>
        <EventPage
          event={{
            bannerUrl: bannerImagePreviewUrl,
            title: values.title,
            description: eventDescription,
            eventBeginDate: getTimestampFromDate(selectedDate.begin.toDate()),
            eventEndDate: getTimestampFromDate(selectedDate.end.toDate()),
            website: values.website,
          }}
          isPreview={true}
        />
      </Dialog>
      <Dialog onClose={() => setShowYoutubePreview(false)} open={showYoutubePreview} maxWidth="sm">
        <iframe
          // className={classes.videoContainer}
          style={{ width: 500, height: 300 }}
          src={`https://www.youtube.com/embed/${values.conferenceRoomYoutubeVideoId}?autoplay=1&fs=0&modestbranding=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="livestream"
        />
      </Dialog>
      <Dialog onClose={() => setShowFacebookPreview(false)} open={showFacebookPreview} maxWidth="sm">
        <div
          style={{ width: 500, height: 300 }}
          className="fb-video"
          data-href={`https://www.facebook.com/facebook/videos/${values.conferenceRoomFacebookVideoId}/`}
          data-width="500"
          data-show-text="false"
        >
          <div className="fb-xfbml-parse-ignore"></div>
        </div>
      </Dialog>
      <Dialog
        onClose={() => setShowEventCreatedDialog(false)}
        open={showEventCreatedDialog}
        maxWidth="sm"
        disableBackdropClick={eventCreated === true}
        disableEscapeKeyDown={eventCreated === true}
      >
        <Paper style={{ padding: "64px 96px" }}>
          {eventCreated === true && (
            <React.Fragment>
              <div style={{ textAlign: "center", width: "100%" }}>
                <SuccessIcon style={{ fontSize: 64, color: "#53a653" }} />
              </div>
              <Typography
                variant="h6"
                align="center"
                display="block"
                style={{ color: "#53a653", marginTop: 16, marginBottom: 32 }}
              >
                Event {isNewEvent ? "created" : "updated"} successfully!
              </Typography>
              <Typography align="center" gutterBottom>
                Your event is accessible at:
              </Typography>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography align="center">
                  <a href={sessionUrl + values.sessionId}>{sessionUrl + values.sessionId}</a>
                </Typography>
                <Tooltip title="Copy event link">
                  <CopyToClipboard
                    text={sessionUrl + values.sessionId}
                    onCopy={() => snackbar.showMessage("Event link copied")}
                  >
                    <IconButton aria-label="copy" style={{ marginLeft: 8 }} size="small" color="primary">
                      <CopyIcon fontSize="inherit" />
                    </IconButton>
                  </CopyToClipboard>
                </Tooltip>
              </div>
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => history.push(routes.EVENT_SESSION(values.sessionId))}
                >
                  Open Event page
                </Button>
              </div>
              <EventShareIcons url={sessionUrl + values.sessionId} shareText={shareText} />
            </React.Fragment>
          )}
          {eventCreated === "ERROR" && (
            <React.Fragment>
              <div style={{ textAlign: "center", width: "100%" }}>
                <FailIcon style={{ fontSize: 64, color: "#E74B54" }} />
              </div>
              <Typography
                variant="h6"
                align="center"
                display="block"
                style={{ color: "#E74B54", marginTop: 16, marginBottom: 16 }}
              >
                An error occured while creating the event...{" "}
              </Typography>
              <Typography align="center" gutterBottom>
                Please contact Veertly team if the error persists
              </Typography>

              <Typography align="center" gutterBottom>
                <a href="mailto:info@veertly.com">info@veertly.com</a>
              </Typography>
            </React.Fragment>
          )}
        </Paper>
      </Dialog>
      {/* </div> */}
      {/* )} */}
    </React.Fragment>
  );
}

export default EditEventSessionForm;
