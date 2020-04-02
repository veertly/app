import React from "react";
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

const styles = theme => ({
  row: {
    flexDirection: "row"
  },
  button: {
    marginTop: theme.spacing(2)
  },
  bottom: {
    textAlign: "center",
    marginTop: 16
  },
  textField: {
    marginTop: 16
    // marginBottom: 16
  }
});

const getUserDefaultValues = user => {
  let { displayName } = user;
  if (!displayName) {
    return { firstName: "", lastName: "" };
  }
  let splitted = displayName.split(" ");
  let firstName = splitted[0];
  let lastName = splitted[splitted.length - 1];
  return {
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
    interestsChips: []
  };
};

const linkedinUrlStatic = "https://linkedin.com/in/";
const twitterUrlStatic = "https://twitter.com/";

function EditProfileForm(props) {
  const { classes, user } = props;

  let [values, setValues] = React.useState(getUserDefaultValues(user));
  const [interestsChips, setInterestsChips] = React.useState([]);

  const handleUpdateField = name => e => {
    setValues({
      ...values,
      [name]: e.target.value,
      linkedinUrl: values.linkedin.trim() !== "" ? linkedinUrlStatic + values.linkedin : null,
      twitterUrl: values.twitter.trim() !== "" ? twitterUrlStatic + values.twitter : null
    });
  };

  const handleAddInterest = _ => {
    if (values.interest.trim() !== "") {
      let label = values.interest;
      let key = uuidv1();
      let newInterests = [...interestsChips];
      newInterests.push({ key, label });

      setInterestsChips(newInterests);
      setValues({ ...values, interest: "", interestsChips: newInterests });
    }
  };

  const handleEmailPrivacy = event => {
    setValues({ ...values, emailPublic: event.target.checked });
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
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          variant="outlined"
          // inputRef={register()}
          value={values.lastName}
          style={{ width: "48%" }}
          // className={clsx(classes.flexGrow, classes.textField)}
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
                : "Your email will not be shared with the participants of this event"
            }
          >
            <FormControlLabel
              control={
                <Switch
                  checked={values.emailPublic}
                  onChange={handleEmailPrivacy}
                  name="emailPrivacy"
                  color="primary"
                />
              }
              label={values.emailPublic ? "Public" : "Private"}
            />
          </Tooltip>
        </FormGroup>
      </Grid>
      <TextField
        fullWidth
        label="LinkedIn Profile"
        name="linkedin"
        variant="outlined"
        className={classes.textField}
        InputProps={{
          startAdornment: <InputAdornment position="start">{linkedinUrlStatic}</InputAdornment>
        }}
        value={values.linkedin}
        onChange={handleUpdateField("linkedin")}
      />
      <TextField
        fullWidth
        label="Twitter Profile"
        name="twitter"
        variant="outlined"
        className={classes.textField}
        value={values.twitter}
        InputProps={{
          startAdornment: <InputAdornment position="start">{twitterUrlStatic}</InputAdornment>
        }}
        value={values.twitter}
        onChange={handleUpdateField("twitter")}
      />
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="Interests"
          name="interest"
          variant="outlined"
          value={values.interest}
          style={{ width: 435 }}
          onChange={handleUpdateField("interest")}
          onKeyPress={ev => {
            if (ev.key === "Enter") {
              // Do code here
              handleAddInterest();
              ev.preventDefault();
            }
          }}
        />
        <Tooltip title="Add interest">
          <IconButton color="primary" aria-label="add interest" onClick={handleAddInterest}>
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Grid>
      <div style={{ marginTop: 8 }}>
        <ProfileChips chips={interestsChips} setChips={setInterestsChips} showEmptyMsg="interests" showDelete={true} />
      </div>
      <div className={classes.bottom}>
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          Update Profile
        </Button>
      </div>
    </React.Fragment>
  );
}

export default withStyles(styles)(EditProfileForm);
