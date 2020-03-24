import React, { useEffect } from "react";
import TitledPaper from "../Core/TitledPaper";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form/dist/react-hook-form.ie11"; // needed because of a minimifying issue: https://github.com/react-hook-form/react-hook-form/issues/773
import { registerNewUser, getUserDb } from "../../Modules/userOperations";
import { useHistory, useLocation } from "react-router-dom";

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
  return { firstName, lastName };
};

function EditProfile(props) {
  const { classes, user } = props;
  const history = useHistory();
  const location = useLocation();
  const { register, handleSubmit, setValue, watch } = useForm({ defaultValues: getUserDefaultValues(user) });
  let mounted = true;
  let fetching = false;
  let callbackUrl = location.search.replace("?callback=", ""); // queryValues.callback ? queryValues.callback : "/";

  console.log("user", user);

  const onSubmit = async data => {
    console.log({ data });
    let newUser = { ...user, displayName: `${data.firstName} ${data.lastName}` };
    registerNewUser(newUser);
    history.push(callbackUrl);
  };

  useEffect(() => {
    const fetchUser = async () => {
      fetching = true;

      let uid = user.uid;
      let userDb = await getUserDb(uid);
      if (mounted && userDb) {
        setValue("firstName", userDb.firstName);
        setValue("lastName", userDb.lastName);
      }
    };
    if (!fetching) {
      fetchUser();
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      <TitledPaper title="Set your profile">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <TextField fullWidth value={user.displayName} label="Name" /> */}
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            variant="outlined"
            inputRef={register({ required: true })}
            className={classes.textField}
            value={watch("firstName")}
            required
            // className={clsx(classes.flexGrow, classes.textField)}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            variant="outlined"
            inputRef={register()}
            className={classes.textField}
            value={watch("lastName")}
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
              Set Profile
            </Button>
          </div>
        </form>
      </TitledPaper>
    </React.Fragment>
  );
}

export default withStyles(styles)(EditProfile);
