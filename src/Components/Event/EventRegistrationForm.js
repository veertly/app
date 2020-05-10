import React, { useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import FailIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";

import _ from "lodash";
import { getUserDb } from "../../Modules/userOperations";
import * as moment from "moment";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import {
  registerToEvent,
  isUserRegisteredToEvent,
} from "../../Modules/eventsOperations";
import MUIAddToCalendar from "../MUIAddToCalendar";
import routes from "../../Config/routes";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { getUrl } from "../../Modules/environments";
import SuccessIcon from "@material-ui/icons/CheckCircleOutline";
import EventShareIcons from "./EventShareIcons";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  row: {
    flexDirection: "row",
  },
  button: {
    marginTop: theme.spacing(3),
  },
  bottom: {
    textAlign: "center",
    // marginTop: 16,
    marginBottom: 8,
  },
  textField: {
    marginTop: 16,
    // marginBottom: 16
  },
}));

// const getDefaultValues = (rsvpProperties) => {
//   let { fields } = rsvpProperties;
//   let fieldsNames = Object.keys(fields);
//   let values = {};
//   for (let i = 0; i < fieldsNames.length; i++) {
//     let field = fieldsNames[i];
//     values[field] = "";
//   }
//   return values;
// };

function EventRegistrationForm(props) {
  const { eventSession, rsvpProperties } = props;
  let { eventBeginDate, eventEndDate, title } = eventSession;

  const classes = useStyles();
  const [userAuth] = useAuthState(firebase.auth());
  // const [userDb, setUserDb] = React.useState(null);

  const [registering, setRegistering] = React.useState(false);
  const [registrationComplete, setRegistrationComplete] = React.useState(false);
  const [registrationFailed, setRegistrationFailed] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(null);

  const formFields = React.useMemo(() => {
    let { fields } = rsvpProperties;
    let orderedFields = _.orderBy(fields, ["order"], ["asc"]);
    return orderedFields;
  }, [rsvpProperties]);

  const [formValues, setFormValues] = React.useState(
    _.reduce(
      rsvpProperties.fields,
      (result, properties) => {
        result[properties.name] = "";
        return result;
      },
      { checkedTerms: false, checkedNewsletter: false }
    )
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (!userAuth) {
        return;
      }
      // console.log("--> On use effect...");
      let userDb = await getUserDb(userAuth.uid);

      if (userDb) {
        const x = (str) => (str ? str : "");

        // setUserDb(normedUser);
        let newFormValues = { ...formValues };
        _.forEach(formFields, (properties, fieldName) => {
          let dbValue = userDb[properties.name]
            ? x(userDb[properties.name])
            : "";
          newFormValues[properties.name] = dbValue;
        });
        setFormValues(newFormValues);
      }
      if (isRegistered === null) {
        setIsRegistered(
          await isUserRegisteredToEvent(eventSession.id, userAuth.uid)
        );
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const submitEnabled = React.useMemo(
    () =>
      /* formValues.checkedTerms && */
      _.reduce(
        rsvpProperties.fields,
        (result, properties) => {
          if (
            properties.required &&
            formValues[properties.name].trim() === ""
          ) {
            return false;
          }
          return result;
        },
        true
        // formValues.checkedTerms
      ),
    [formValues, rsvpProperties.fields]
  );

  const calendarEvent = React.useMemo(() => {
    const {
      id,
      description,
      title,
      eventBeginDate,
      eventEndDate,
    } = eventSession;
    const sessionUrl = getUrl() + routes.EVENT_SESSION(id);
    let descriptionText = "";
    let rawDescription = "";
    if (description) {
      const parsedDescription = JSON.parse(description);
      let descriptionContent = convertFromRaw(parsedDescription);
      rawDescription = parsedDescription.blocks.reduce((acc, item) => {
        acc += item.text;
        return acc;
      }, "");
      // descriptionText = descriptionContent.getPlainText("\n\n");
      descriptionText = stateToHTML(descriptionContent);
    }
    return {
      id,
      title,
      description: descriptionText,
      location: sessionUrl,
      startTime: moment(eventBeginDate.toDate()),
      endTime: moment(eventEndDate.toDate()),
      rawDescription,
    };
  }, [eventSession]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // console.log(formValues);

    setRegistering(true);
    try {
      await registerToEvent(
        eventSession,
        userAuth ? userAuth.uid : null,
        formValues
      );
      setRegistrationComplete(true);
    } catch (e) {
      console.error(e);
      setRegistrationFailed(e.message);
    }
  };

  let beginDate = eventBeginDate ? moment(eventBeginDate.toDate()) : null;
  let endDate = eventEndDate ? moment(eventEndDate.toDate()) : null;

  const isSameDay = beginDate ? beginDate.isSame(endDate, "day") : false;

  const shareText = React.useMemo(
    () =>
      `Join me in the virtual event ${eventSession.title} at ${moment(
        eventSession.eventBeginDate.toDate()
      ).format("lll")} on @veertly `,
    [eventSession.title, eventSession.eventBeginDate]
  );

  if (isRegistered === true) {
    return <Typography align="center">User is already registered!</Typography>;
  }
  return (
    <React.Fragment>
      <Typography variant="h4" color="primary" align="left">
        {title}
      </Typography>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        {beginDate && (
          <Typography color="textSecondary">
            <span role="img" aria-label="calendar">
              📅
            </span>
            {isSameDay
              ? beginDate.format("lll") + " to " + endDate.format("LT")
              : beginDate.format("lll") + " to " + endDate.format("lll")}
          </Typography>
        )}
      </div>
      {registrationComplete === false && registrationFailed === false && (
        <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
          {_.map(formFields, (properties, fieldName) => {
            if (properties.visible === false) {
              return null;
            }
            if (properties.type === "alert") {
              return (
                <Alert severity={properties.data.severity}>
                  {properties.data.text}
                </Alert>
              );
            }
            return (
              <TextField
                fullWidth
                label={properties.label}
                name={properties.name}
                variant="outlined"
                className={classes.textField}
                required={properties.required}
                helperText={
                  properties.helperText ? properties.helperText : null
                }
                key={fieldName}
                type={properties.type}
                value={formValues[properties.name]}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [properties.name]: e.target.value,
                  })
                }
              />
            );
          })}
          {/* <div style={{ textAlign: "left", marginTop: 16 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.checkedNewsletter}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      checkedNewsletter: e.target.checked,
                    })
                  }
                  name="checkedNewsletter"
                  color="primary"
                />
              }
              label={
                <span>
                  Join our monthly newsletter and stay updated on new features
                </span>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.checkedTerms}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      checkedTerms: e.target.checked,
                    })
                  }
                  name="checkedTerms"
                  color="primary"
                />
              }
              label={
                <span>
                  I accept the{" "}
                  <a
                    href="https://veertly.com/terms-of-service/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>{" "}
                  &amp;{" "}
                  <a
                    href="https://veertly.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </span>
              }
            />
          </div> */}
          <div className={classes.bottom}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.button}
              disabled={!submitEnabled || registering}
            >
              Confirm Registration
            </Button>
            <Typography
              /* variant="caption" */ color="textSecondary"
              display="block"
              style={{ marginTop: 24 }}
            >
              <span>
                By proceeding, you accept the{" "}
                <a
                  href="https://veertly.com/terms-of-service/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                &amp;{" "}
                <a
                  href="https://veertly.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </span>
            </Typography>
          </div>
        </form>
      )}
      {registrationComplete === true && (
        <React.Fragment>
          <div style={{ padding: 32 }}>
            <div style={{ textAlign: "center", width: "100%" }}>
              <SuccessIcon style={{ fontSize: 64, color: "#53a653" }} />
            </div>
            <Typography
              variant="h6"
              align="center"
              display="block"
              style={{ color: "#53a653", marginTop: 16, marginBottom: 32 }}
            >
              You are now registered to {title}!
            </Typography>{" "}
            <div style={{ textAlign: "center" }}>
              <MUIAddToCalendar event={calendarEvent} isPrimaryButton={false} />
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <EventShareIcons
                url={getUrl() + routes.EVENT_SESSION(eventSession.id)}
                shareText={shareText}
              />
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Button variant="text" color="primary" onClick={props.onClose}>
                Close
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}

      {registrationFailed && (
        <React.Fragment>
          <div style={{ padding: 32 }}>
            <div style={{ textAlign: "center", width: "100%" }}>
              <FailIcon style={{ fontSize: 64, color: "#E74B54" }} />
            </div>
            <Typography
              variant="h6"
              align="center"
              display="block"
              style={{ color: "#E74B54", marginTop: 16, marginBottom: 16 }}
            >
              An error occured while registering you to the event...{" "}
            </Typography>
            <Typography align="center">{registrationFailed}</Typography>
            <Typography align="center" gutterBottom>
              Please contact Veertly team if you have any question
            </Typography>

            <Typography align="center" gutterBottom>
              <a href="mailto:info@veertly.com">info@veertly.com</a>
            </Typography>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Button variant="text" color="primary" onClick={props.onClose}>
                Close
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default EventRegistrationForm;
