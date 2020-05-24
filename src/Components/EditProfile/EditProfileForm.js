import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import ParticipantCard from "../EventSession/ParticipantCard";
import ProfileChips from "./ProfileChips";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { v1 as uuidv1 } from "uuid";
import { getUserDb, updateUser } from "../../Modules/userOperations";
// import Checkbox from "@material-ui/core/Checkbox";
import LinkedinIcon from "../../Assets/Icons/Linkedin";
import TwitterIcon from "../../Assets/Icons/Twitter";
import KeybaseIcon from "../../Assets/Icons/Keybase";
import LocationAutoComplete from "../Misc/LocationAutoComplete";
import useIsMounted from "../../Hooks/useIsMounted";
// import LocationAutoComplete from "../Misc/LocationAutoComplete";

const useStyles = makeStyles((theme) => ({
  row: {
    flexDirection: "row"
  },
  button: {
    marginTop: theme.spacing(2)
  },
  bottom: {
    textAlign: "center",
    marginTop: 8
  },
  textField: {
    marginTop: 16
    // marginBottom: 16
  },
  star: {
    fontSize: 16,
    marginRight: 4
  },
  termsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));

const getUserDefaultValues = (userAuth) => {
  let { displayName, isAnonymous } = userAuth;
  let firstName = "";
  let lastName = "";
  if (displayName) {
    let splitted = displayName.split(" ");
    firstName = splitted[0];
    lastName = splitted[splitted.length - 1];
  }
  // IF UPDATED, don't forget to update the registerNewUser on the userOperations.js file
  return {
    id: userAuth.uid,
    firstName,
    lastName,
    email: userAuth.email ? userAuth.email : "",
    linkedin: "",
    twitter: "",
    keybase: "",
    emailPublic: false,
    avatarUrl: userAuth.photoURL ? userAuth.photoURL : "",
    interest: "",
    twitterUrl: null,
    linkedinUrl: null,
    interestsChips: [],
    company: "",
    companyTitle: "",
    isAnonymous,
    checkedTerms: false,
    checkedNewsletter: false,
    location: ""
  };
};

const linkedinUrlStatic = "https://linkedin.com/in/";
const twitterUrlStatic = "https://twitter.com/";
const keybaseUrlStatic = "https://keybase.io/";

function EditProfileForm(props) {
  const { userAuth, sessionId, profileUpdatedCallback } = props;
  const classes = useStyles();

  let [values, setValues] = React.useState(getUserDefaultValues(userAuth));
  // let [dbCheckNewsletter, setDbCheckNewsletter] = React.useState(null);
  let [errors, setErrors] = React.useState({});
  const [interestsChips, setInterestsChips] = React.useState([]);

  const [updating, setUpdating] = React.useState(false);
  const mounted = useIsMounted();
  useEffect(() => {
    const fetchUser = async () => {
      if (!userAuth) {
        return;
      }
      let userDb = await getUserDb(userAuth.uid);
      if (mounted) {
        if (userDb) {
          let {
            firstName,
            lastName,
            email,
            linkedin,
            twitter,
            keybase,
            emailPublic,
            avatarUrl,
            twitterUrl,
            linkedinUrl,
            keybaseUrl,
            interestsChips,
            company,
            companyTitle,
            checkedTerms,
            checkedNewsletter,
            location,
            locationDetails
          } = userDb;

          const x = (str) => (str ? str : "");

          // IF UPDATED, don't forget to update the registerNewUser on the userOperations.js file
          setValues((v) => ({
            ...v,
            firstName: x(firstName),
            lastName: x(lastName),
            email: x(email),
            linkedin: x(linkedin),
            twitter: x(twitter),
            keybase: x(keybase),
            emailPublic: emailPublic === true,
            avatarUrl: x(avatarUrl),
            twitterUrl: x(twitterUrl),
            linkedinUrl: x(linkedinUrl),
            keybaseUrl: x(keybaseUrl),
            interestsChips: interestsChips ? interestsChips : [],
            company: x(company),
            companyTitle: x(companyTitle),
            checkedNewsletter: checkedNewsletter === true,
            checkedTerms: checkedTerms === true,
            location: x(location),
            locationDetails: locationDetails ? locationDetails : null
          }));

          setInterestsChips(interestsChips ? interestsChips : []);
          // setDbCheckNewsletter(checkedNewsletter === true);
        }
      }
    };
    fetchUser();
  }, [userAuth, mounted]);

  if (!userAuth && !sessionId) {
    return <p>No session available...</p>;
  }
  const handleUpdateField = (name) => (e) => {
    let value = e.target.value;
    let newValues = { ...values };
    newValues[name] = value;
    if (name === "linkedin") {
      let v = value.includes("linkedin.com")
        ? value
        : linkedinUrlStatic + value;
      v = v.includes("http") ? v : `https://${v}`;
      newValues.linkedinUrl = value.trim() !== "" ? v : null;
    }

    if (name === "twitter") {
      let v = value.includes("twitter.com") ? value : twitterUrlStatic + value;
      v = v.includes("http") ? v : `https://${v}`;
      newValues.twitterUrl = value.trim() !== "" ? v : null;
    }

    if (name === "keybase") {
      let v = value.includes("keybase.io") ? value : keybaseUrlStatic + value;
      v = v.includes("http") ? v : `https://${v}`;
      newValues.keybaseUrl = value.trim() !== "" ? v : null;
    }
    setValues(newValues);
  };

  const handleAddInterest = (_) => {
    if (values.interest.trim() !== "") {
      let label = values.interest;
      let key = uuidv1();
      let newInterests = [...interestsChips];
      newInterests.push({ key, label });

      setInterestsChips(newInterests);
      setValues({ ...values, interest: "", interestsChips: newInterests });
    }
  };

  const handleNewInterestsChips = (chips) => {
    setInterestsChips(chips);
    setValues({ ...values, interest: "", interestsChips: chips });
  };

  const handleCheckbox = (name) => (event) => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const handleUpdateProfile = async () => {
    if (values.firstName.trim() === "") {
      setErrors({ firstName: "First name can't be empty" });
      return;
    }
    setUpdating(true);
    await updateUser(userAuth.uid, sessionId, values);
    // await fetchUser();
    // snackbar.showMessage("Your profile has been updated successfuly");
    if (profileUpdatedCallback) {
      profileUpdatedCallback();
    }
    setUpdating(false);
  };

  const handlePictureChanged = (pictureUrl) => {
    setValues({ ...values, avatarUrl: pictureUrl });
  };
  const handleLocationChange = (value) => {
    if (value) {
      setValues({
        ...values,
        location: value.description,
        locationDetails: value
      });
    } else {
      setValues({ ...values, location: "", locationDetails: null });
    }
  };

  return (
    <React.Fragment>
      <div style={{ marginBottom: 32 }}>
        <ParticipantCard
          participant={values}
          editPicture={true}
          onPictureChanged={handlePictureChanged}
        />
      </div>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          variant="outlined"
          value={values.firstName}
          required
          style={{ width: "48%" }}
          onChange={handleUpdateField("firstName")}
          helperText={errors.firstName ? errors.firstName : null}
          error={errors.firstName !== undefined}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          variant="outlined"
          value={values.lastName}
          style={{ width: "48%" }}
          onChange={handleUpdateField("lastName")}
        />
      </Grid>

      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          variant="outlined"
          value={values.email}
          style={{ width: 380 }}
          onChange={handleUpdateField("email")}
        />
        <FormGroup row>
          <Tooltip
            title={
              values.emailPublic
                ? "Your email will be shared with the participants of this event"
                : "Your email will only be shared with the organizers"
            }
          >
            <FormControlLabel
              control={
                <Switch
                  checked={values.emailPublic}
                  onChange={handleCheckbox("emailPublic")}
                  name="emailPublic"
                  color="primary"
                />
              }
              label={values.emailPublic ? "Public" : "Private"}
            />
          </Tooltip>
        </FormGroup>
      </Grid>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Job Title"
          name="companyTitle"
          variant="outlined"
          // inputRef={register()}
          value={values.companyTitle}
          style={{ width: "48%" }}
          // className={clsx(classes.flexGrow, classes.textField)}
          onChange={handleUpdateField("companyTitle")}
        />
        <TextField
          fullWidth
          label="Company"
          name="company"
          variant="outlined"
          value={values.company}
          style={{ width: "48%" }}
          onChange={handleUpdateField("company")}
        />
      </Grid>
      {/* <TextField
        fullWidth
        label="Short Bio"
        name="shortBio"
        variant="outlined"
        className={classes.textField}
        value={values.shortBio}
        onChange={handleUpdateField("shortBio")}
      /> */}
      <div className={classes.textField} style={{ width: "100%" }}>
        <LocationAutoComplete
          onLocationChanged={handleLocationChange}
          value={values.location}
        />
      </div>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="LinkedIn Handle"
          name="linkedin"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkedinIcon color="primary" />
              </InputAdornment>
            )
          }}
          style={{ width: "32%" }}
          value={values.linkedin}
          onChange={handleUpdateField("linkedin")}
        />
        <TextField
          fullWidth
          label="Twitter Handle"
          name="twitter"
          variant="outlined"
          style={{ width: "32%" }}
          value={values.twitter}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TwitterIcon color="primary" />
              </InputAdornment>
            )
          }}
          onChange={handleUpdateField("twitter")}
        />
        <TextField
          fullWidth
          label="Keybase Handle"
          name="keybase"
          variant="outlined"
          style={{ width: "32%" }}
          value={values.keybase}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeybaseIcon color="primary" />
              </InputAdornment>
            )
          }}
          onChange={handleUpdateField("keybase")}
        />
      </Grid>
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Interests/Hobbies"
          name="interest"
          variant="outlined"
          value={values.interest}
          style={{ width: 435 }}
          onChange={handleUpdateField("interest")}
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              // Do code here
              handleAddInterest();
              ev.preventDefault();
            }
          }}
          helperText={`${interestsChips.length}/5 interests added`}
          disabled={interestsChips.length >= 5}
        />
        <div>
          <Tooltip title="Add interest">
            <IconButton
              color="primary"
              aria-label="add interest"
              onClick={handleAddInterest}
              disabled={interestsChips.length >= 5}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>
      </Grid>

      <div style={{ marginTop: 8 }}>
        <ProfileChips
          chips={interestsChips}
          onDelete={handleNewInterestsChips}
        />
      </div>

      {/* <div style={{ textAlign: "left", marginTop: 16 }}>
        {dbCheckNewsletter !== true && (
          <FormControlLabel
            control={
              <Checkbox
                checked={values.checkedNewsletter}
                onChange={handleCheckbox("checkedNewsletter")}
                name="checkedNewsletter"
                color="primary"
              />
            }
            label={
              <span>
                Join Veertly's monthly newsletter and stay updated on new
                features
              </span>
            }
          />
        )}
        <FormControlLabel
          control={
            <div className={classes.termsContainer}>
              <Checkbox
                checked={values.checkedTerms}
                onChange={handleCheckbox("checkedTerms")}
                name="checkedTerms"
                color="primary"
              />
              {values.checkedTerms !== true && (
                <Typography
                  className={classes.star}
                  color="error"
                  align="center"
                  variant="caption"
                >
                  *
                </Typography>
              )}
            </div>
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
        {/* {values.checkedTerms !== true && (
          <Typography align="center" color="textSecondary">
            You need to accept the Terms of Service and the Privacy Policy
          </Typography>
        )} */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
          onClick={handleUpdateProfile}
          disabled={updating /* || values.checkedTerms !== true */}
        >
          Update Profile
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
    </React.Fragment>
  );
}

// EditProfileForm.whyDidYouRender = true;
export default EditProfileForm;
