import React, { useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
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
import uuidv1 from "uuid/v1";
import { getUserDb, updateUser } from "../../Modules/userOperations";
import Checkbox from "@material-ui/core/Checkbox";
import LinkedinIcon from "../../Assets/Icons/Linkedin";
import TwitterIcon from "../../Assets/Icons/Twitter";
import KeybaseIcon from "../../Assets/Icons/Keybase";
// import LocationAutoComplete from "../Misc/LocationAutoComplete";

const styles = (theme) => ({
  row: {
    flexDirection: "row",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  bottom: {
    textAlign: "center",
    marginTop: 16,
  },
  textField: {
    marginTop: 16,
    // marginBottom: 16
  },
});

const getUserDefaultValues = (user) => {
  let { displayName, isAnonymous } = user;
  let firstName = "";
  let lastName = "";
  if (displayName) {
    let splitted = displayName.split(" ");
    firstName = splitted[0];
    lastName = splitted[splitted.length - 1];
  }
  return {
    id: user.uid,
    firstName,
    lastName,
    email: user.email ? user.email : "",
    linkedin: "",
    twitter: "",
    emailPublic: false,
    avatarUrl: user.photoURL,
    interest: "",
    twitterUrl: null,
    linkedinUrl: null,
    interestsChips: [],
    company: "",
    companyTitle: "",
    isAnonymous,
    checkedTerms: false,
    checkedNewsletter: false,
  };
};

const linkedinUrlStatic = "https://linkedin.com/in/";
const twitterUrlStatic = "https://twitter.com/";
const keybaseUrlStatic = "https://keybase.io/";

function EditProfileForm(props) {
  const { classes, user, sessionId, profileUpdatedCallback } = props;

  let [values, setValues] = React.useState(getUserDefaultValues(user));
  let [errors, setErrors] = React.useState({});
  const [interestsChips, setInterestsChips] = React.useState([]);
  const [updating, setUpdating] = React.useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        return;
      }
      let userDb = await getUserDb(user.uid);

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
        } = userDb;

        const x = (str) => (str ? str : "");

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
        }));

        setInterestsChips(interestsChips ? interestsChips : []);
      }
    };
    fetchUser();
  }, [user]);

  if (!user && !sessionId) {
    return <p>No session available...</p>;
  }
  const handleUpdateField = (name) => (e) => {
    let value = e.target.value;
    let newValues = { ...values };
    newValues[name] = value;
    if (name === "linkedin") {
      newValues.linkedinUrl = value.trim() !== "" ? linkedinUrlStatic + value : null;
    }

    if (name === "twitter") {
      newValues.twitterUrl = value.trim() !== "" ? twitterUrlStatic + value : null;
    }

    if (name === "keybase") {
      newValues.keybaseUrl = value.trim() !== "" ? keybaseUrlStatic + value : null;
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
    await updateUser(user.uid, sessionId, values);
    // await fetchUser();
    // snackbar.showMessage("Your profile has been updated successfuly");
    if (profileUpdatedCallback) {
      profileUpdatedCallback();
    }
    setUpdating(false);
  };
  return (
    <React.Fragment>
      <div style={{ marginBottom: 32 }}>
        <ParticipantCard participant={values} />
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
      {/* <LocationAutoComplete /> */}
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
            ),
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
            ),
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
            ),
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
        <ProfileChips chips={interestsChips} onDelete={handleNewInterestsChips} />
      </div>

      <div style={{ textAlign: "left", marginTop: 16 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.checkedNewsletter}
              onChange={handleCheckbox("checkedNewsletter")}
              name="checkedNewsletter"
              color="primary"
            />
          }
          label={<span>Join our monthly newsletter and stay updated on new features</span>}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.checkedTerms}
              onChange={handleCheckbox("checkedTerms")}
              name="checkedTerms"
              color="primary"
            />
          }
          label={
            <span>
              I accept the{" "}
              <a href="https://veertly.com/terms-of-service/" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a href="https://veertly.com/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
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
          onClick={handleUpdateProfile}
          disabled={updating || values.checkedTerms !== true}
        >
          Update Profile
        </Button>
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(EditProfileForm);
