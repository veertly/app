import React, { useEffect } from "react";
import TitledPaper from "../Core/TitledPaper";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form/dist/react-hook-form.ie11"; // needed because of a minimifying issue: https://github.com/react-hook-form/react-hook-form/issues/773
import { registerNewUser, getUserDb } from "../../Modules/userOperations";
import { useHistory, useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
  row: {
    flexDirection: "row"
  },
  button: {
    marginTop: theme.spacing(2)
  },
  bottom: {
    textAlign: "right"
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
  return { firstName, lastName, linkedin: "", twitter: "" };
};

const linkedinUrlStatic = "https://linkedin.com/in/";
const twitterUrlStatic = "https://twitter.com";

function EditProfileForm(props) {
  const { classes, user } = props;
  const history = useHistory();
  const location = useLocation();
  // const [userProfile, loadingUserProfile, errorUserProfile] = useDocumentData(
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(user.uid)
  // );

  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: getUserDefaultValues(user) });

  let [values, setValues] = React.useState(getUserDefaultValues(user));
  let [fetched, setFetched] = React.useState(false);

  let mounted = true;
  let fetching = false;
  let callbackUrl = location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";

  console.log("user", user);

  // const onSubmit = async data => {
  //   console.log({ data });
  //   let newUser = { ...user, displayName: `${data.firstName} ${data.lastName}` };
  //   registerNewUser(newUser);
  //   history.push(callbackUrl);
  // };

  const handleUpdateField = name => e => {
    let res = { ...values };
    res[name] = e.target.value;
    setValues(res);
  };

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     fetching = true;

  //     let uid = user.uid;
  //     let userDb = await getUserDb(uid);
  //     console.log({ userDb });
  //     debugger;
  //     if (mounted && userDb) {
  //       setValues({
  //         ...values,
  //         firstName: userDb.firstName,
  //         lastName: userDb.lastName,
  //         linkedin: userDb.linkedinUrl ? userDb.linkedinUrl.replace(linkedinUrlStatic, "") : "",
  //         twitter: userDb.twitterUrl ? userDb.twitterUrl.replace(twitterUrlStatic, "") : ""
  //       });
  //       setFetched(true);
  //     }
  //   };
  //   if (!fetching && !fetched) {
  //     fetchUser();
  //   }
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  return (
    <React.Fragment>
      {/* <TitledPaper title="Set your profile"> */}
      {/* <form onSubmit={handleSubmit§(onSubmit)}> */}
      <Typography align="left" variant="h5" style={{ textTransform: "uppercase" }}>
        Edit Profile
      </Typography>
      {/* <TextField fullWidth value={user.displayName} label="Name" /> */}
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        variant="outlined"
        // inputRef={register({ required: true })}
        className={classes.textField}
        value={values.firstName}
        // required
        // style={{ width: "48%" }}
        onChange={handleUpdateField("firstName")}
        // className={clsx(classes.flexGrow, classes.textField)}
      />
      <Grid container justify="space-between" className={classes.textField}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          variant="outlined"
          // inputRef={register({ required: true })}
          className={classes.textField}
          value={values.firstName}
          required
          style={{ width: "48%" }}
          onChange={handleUpdateField("firstName")}
          // className={clsx(classes.flexGrow, classes.textField)}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          variant="outlined"
          // inputRef={register()}
          className={classes.textField}
          value={values.lastName}
          style={{ width: "48%" }}
          // className={clsx(classes.flexGrow, classes.textField)}
        />
      </Grid>
      <TextField
        fullWidth
        label="LinkedIn Profile"
        name="linkedin"
        variant="outlined"
        // inputRef={register()}
        className={classes.textField}
        // value={values.linkedin}
        InputProps={{
          startAdornment: <InputAdornment position="start">{linkedinUrlStatic}</InputAdornment>
        }}
        // className={clsx(classes.flexGrow, classes.textField)}
      />
      <TextField
        fullWidth
        label="Twitter Profile"
        name="twitter"
        variant="outlined"
        // inputRef={register()}
        className={classes.textField}
        value={values.twitter}
        InputProps={{
          startAdornment: <InputAdornment position="start">{twitterUrlStatic}</InputAdornment>
        }}
        // className={clsx(classes.flexGrow, classes.textField)}
      />
      {/* <TextField
            fullWidth
            label="First Name"
            name="firstName"
            variant="outlined"
            inputRef={register()}
            className={clsx(classes.flexGrow, classes.textField)}
          /> */}
      <div className={classes.bottom}>
        <Button variant="contained" color="secondary" type="submit" className={classes.button}>
          Update Profile
        </Button>
      </div>
      {/* </form> */}
      {/* </TitledPaper> */}
    </React.Fragment>
  );
}

export default withStyles(styles)(EditProfileForm);
