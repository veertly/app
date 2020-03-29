import React, { useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form/dist/react-hook-form.ie11"; // needed because of a minimifying issue: https://github.com/react-hook-form/react-hook-form/issues/773
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
// import "date-fns";

// import DateFnsUtils from "@date-io/date-fns";$

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import Grid from "@material-ui/core/Grid";
import { getUrl } from "../../Modules/environments";
import { conferenceExists } from "../../Modules/eventsOperations";
import { createConference } from "../../Modules/eventSessionOperations";
import routes from "../../Config/routes";

// const styles = theme => ({
//   row: {
//     flexDirection: "row"
//   },
//   button: {
//     marginTop: theme.spacing(2)
//   },
//   bottom: {
//     textAlign: "right"
//   },
//   textField: {
//     marginTop: 16
//     // marginBottom: 16
//   }
// });

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 1, 3, 1),
    [theme.breakpoints.up("sm")]: {
      margin: theme.spacing(6)
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: 16
    // marginBottom: 16
  },
  button: {
    marginTop: theme.spacing(4)
  },
  bottom: {
    textAlign: "center"
  }
}));

const sessionUrl = getUrl() + "/v/";

function EditEventSessionForm(props) {
  const classes = useStyles();
  const history = useHistory();

  const { user, isNewEvent, sessionId } = props;
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      sessionId: sessionId !== undefined ? sessionId : "",
      title: "",
      conferenceRoomYoutubeVideoId: "",
      website: "",
      expectedAmountParticipants: ""
    }
  });
  const selectedSessionId = watch("sessionId");
  const [selectedVideoType, setSelectedVideoType] = React.useState("YOUTUBE");
  const [selectedDate, setSelectedDate] = React.useState(moment());
  const [sessionIdError, setSessionIdError] = React.useState(false);
  const [creatingEvent, setCreatingEvent] = React.useState(false);
  const [eventCreated, setEventCreated] = React.useState(false);

  let mounted = true;
  // let fetching = false;
  // let callbackUrl = location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";

  const handleVideoTypeChange = event => {
    setSelectedVideoType(event.target.value);
  };
  const handleDateChange = date => {
    console.log(date);
    setSelectedDate(date);
  };
  const onSubmit = async data => {
    console.log({ data });
    // let values = { ...data, conferenceVideoType: selectedVideoType, liveAt: selectedDate.unix() };
    // console.log({ values });
    setCreatingEvent(true);
    try {
      await createConference(
        data.sessionId,
        user.uid,
        data.title,
        selectedVideoType,
        data.conferenceRoomYoutubeVideoId,
        data.website,
        data.expectedAmountParticipants,
        selectedDate.unix()
      );
      setEventCreated(true);
    } catch (e) {
      console.error(e);
      setEventCreated("ERROR");
    }
    setCreatingEvent(false);
  };

  useEffect(() => {
    const verifySessionId = async id => {
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
    if (selectedSessionId.trim() !== "") {
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
      <div className={classes.root}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" align="center">
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
          <Typography variant="caption" display="block" style={{ marginTop: 16, marginBottom: 8 }}>
            Please complete this form to create your own virtual event. As soon as your event has been created, you can
            share the dial-in link with your audience.
          </Typography>

          <TextField
            fullWidth
            label="Event Title"
            name="title"
            variant="outlined"
            inputRef={register({ required: true })}
            className={classes.textField}
            value={watch("title")}
            required
            helperText="Title of your event"
            disabled={isAnonymous}
          />
          <TextField
            fullWidth
            label="Event URL"
            name="sessionId"
            variant="outlined"
            inputRef={register({ required: true })}
            className={classes.textField}
            value={watch("sessionId")}
            helperText={
              !sessionIdError
                ? "This will be the url to your live event, it should not contain any space, it is case sensitive and once created it cannot be changed"
                : "This URL is already in use, please select a new one"
            }
            required
            error={sessionIdError}
            InputProps={{
              startAdornment: <InputAdornment position="start">{sessionUrl}</InputAdornment>
            }}
            disabled={isAnonymous}
          />
          <FormControl component="fieldset" className={classes.textField} disabled={isAnonymous}>
            <FormLabel component="legend">Conference Room Type</FormLabel>
            <RadioGroup aria-label="gender" name="videoType" value={selectedVideoType} onChange={handleVideoTypeChange}>
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
              inputRef={register({ required: selectedVideoType === "YOUTUBE" })}
              required={selectedVideoType === "YOUTUBE"}
              className={classes.textField}
              value={watch("conferenceRoomYoutubeVideoId")}
              helperText="The video id can be found on the youtube link of your livestream: https://www.youtube.com/watch?v=<VIDEO_ID>"
              disabled={isAnonymous}
            />
          )}
          <TextField
            fullWidth
            label="Official event website"
            name="website"
            variant="outlined"
            inputRef={register()}
            className={classes.textField}
            value={watch("website")}
            helperText="Add the link to the official event website (if available) or the website of your organisation"
            disabled={isAnonymous}
          />
          <TextField
            fullWidth
            label="Expected amount of participants"
            name="expectedAmountParticipants"
            variant="outlined"
            inputRef={register()}
            type="number"
            className={classes.textField}
            value={watch("expectedAmountParticipants")}
            helperText="This value will not have a direct impact in the functionalities, but helps us to monitor and follow closely each event"
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
                  "aria-label": "change date"
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
                  "aria-label": "change time"
                }}
                inputVariant="outlined"
                style={{ width: "48%" }}
                disabled={isAnonymous}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <div className={classes.bottom}>
            {!creatingEvent && eventCreated !== true && (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
                disabled={isAnonymous}
              >
                Create Event
              </Button>
            )}
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
                  <a href={sessionUrl + watch("sessionId")}>{sessionUrl + watch("sessionId")}</a>
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
        </form>
      </div>
    </React.Fragment>
  );
}

export default EditEventSessionForm;
