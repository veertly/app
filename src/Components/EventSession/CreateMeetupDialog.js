import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { registerNewMeetup } from "../../Modules/meetupOperations";

const useStyles = makeStyles(theme => ({
  content: {
    position: "relative",
    padding: theme.spacing(4)
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(2)
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2)
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4)
  }
}));

export default function(props) {
  const classes = useStyles();

  const { open, setOpen } = props;

  const [values, setValues] = useState({
    name: "",
    email: "",
    event: "",
    website: "",
    when: "",
    description: "",
    comments: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = name => event => {
    console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitMeetup = async () => {
    await registerNewMeetup(values);
    setSubmitted(true);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        //  PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <div className={classes.content}>
          <Typography variant="h6" gutterBottom>
            Organize a virtual meetup
          </Typography>
          <TextField
            id="name"
            label="Your name"
            // className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
            fullWidth
          />
          <TextField
            id="email"
            label="Email address"
            // className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
            fullWidth
          />
          <TextField
            id="event"
            label="Event name"
            // className={classes.textField}
            value={values.event}
            onChange={handleChange("event")}
            margin="normal"
            fullWidth
          />
          <TextField
            id="website"
            label="Official event website"
            // className={classes.textField}
            value={values.website}
            onChange={handleChange("website")}
            margin="normal"
            fullWidth
          />
          <TextField
            id="when"
            label="Event date"
            // className={classes.textField}
            value={values.when}
            onChange={handleChange("when")}
            margin="normal"
            fullWidth
          />
          <TextField
            id="description"
            label="Event description"
            multiline
            // className={classes.textField}
            value={values.description}
            onChange={handleChange("description")}
            margin="normal"
            fullWidth
          />
          <TextField
            id="comments"
            label="Additional comments"
            multiline
            // className={classes.textField}
            value={values.comments}
            onChange={handleChange("comments")}
            margin="normal"
            fullWidth
          />

          {!submitted && (
            <div className={classes.buttonContainer}>
              <Button variant="contained" color="secondary" className={classes.button} onClick={submitMeetup}>
                Submit
              </Button>
            </div>
          )}
          {submitted && (
            <Typography className={classes.hintText} variant="caption">
              Thank you, your request has been submitted successfully and we will contact you in the next hours.
            </Typography>
          )}
        </div>
      </Dialog>
    </div>
  );
}
