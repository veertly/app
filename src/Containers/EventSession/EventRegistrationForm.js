import React, { useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
// import { useSnackbar } from "material-ui-snackbar-provider";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";

import _ from "lodash";
import ParticipantCard from "../../Components/EventSession/ParticipantCard";
import { getUserDb } from "../../Modules/userOperations";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { registerToEvent } from "../../Modules/eventsOperations";
const useStyles = makeStyles((theme) => ({
  row: {
    flexDirection: "row",
  },
  button: {
    marginTop: theme.spacing(2),
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
  let { eventBeginDate, eventEndDate, title, id } = eventSession;

  const classes = useStyles();
  const [user] = useAuthState(firebase.auth());
  const [userDb, setUserDb] = React.useState(null);

  const [updating, setUpdating] = React.useState(false);

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
      { checkedTerms: false }
    )
  );

  const fetchUser = async () => {
    if (!user) {
      return;
    }
    let userDb = await getUserDb(user.uid);

    if (userDb) {
      let { firstName, lastName, email } = userDb;

      const x = (str) => (str ? str : "");
      const normedUser = {
        firstName: x(firstName),
        lastName: x(lastName),
        email: x(email),
      };
      setUserDb(normedUser);
      let newFormValues = { ...formValues };
      _.forEach(formFields, (properties, fieldName) => {
        newFormValues[properties.name] = normedUser[properties.name];
      });
      setFormValues(newFormValues);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  const submitEnabled = React.useMemo(
    () =>
      formValues.checkedTerms &&
      _.reduce(
        rsvpProperties.fields,
        (result, properties) => {
          if (properties.required && formValues[properties.name].trim() === "") {
            return false;
          }
          return result;
        },
        formValues.checkedTerms
      ),
    [formValues]
  );

  const onSubmit = () => {
    console.log(formValues);

    registerToEvent(eventSession.id, user ? user.uid : null, formValues);
  };

  let beginDate = eventBeginDate ? moment(eventBeginDate.toDate()) : null;
  let endDate = eventEndDate ? moment(eventEndDate.toDate()) : null;

  const isSameDay = beginDate ? beginDate.isSame(endDate, "day") : false;

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
      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        {_.map(formFields, (properties, fieldName) => {
          return (
            <TextField
              fullWidth
              label={properties.label}
              name={properties.name}
              variant="outlined"
              className={classes.textField}
              required={properties.required}
              helperText={properties.helperText ? properties.helperText : null}
              key={fieldName}
              type={properties.type}
              value={formValues[properties.name]}
              onChange={(e) => setFormValues({ ...formValues, [properties.name]: e.target.value })}
            />
          );
        })}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formValues.checkedTerms}
                onChange={(e) => setFormValues({ ...formValues, checkedTerms: e.target.checked })}
                name="checkedTerms"
                color="primary"
              />
            }
            label={
              <span>
                I accept the{" "}
                <a href="https://veertly.com" target="_blank">
                  Terms of Service and Privacy Policy
                </a>
              </span>
            }
          />
        </div>
        <div className={classes.bottom}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
            disabled={updating}
            disabled={!submitEnabled}
          >
            Confirm Registration
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
}

export default EventRegistrationForm;
