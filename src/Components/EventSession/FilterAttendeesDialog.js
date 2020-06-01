import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import FormGroup from "@material-ui/core/FormGroup";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getUsers,
  getParticipantsJoined,
  setFilters
} from "../../Redux/eventSession";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DialogClose from "../Misc/DialogClose";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(6)
  },
  closeContainer: {
    position: "absolute"
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(4)
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
  },
  autoComplete: {
    width: "100%"
  },
  caption: {
    marginTop: theme.spacing(1)
  }
}));

export default function (props) {
  const classes = useStyles();

  const { open, setOpen, filters } = props;

  const [internalFilters, setInternalFilters] = React.useState(filters);

  const users = useSelector(getUsers, shallowEqual);
  const participantsJoined = useSelector(getParticipantsJoined, shallowEqual);

  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const usersInterests = React.useMemo(() => {
    let result = {};
    _.forEach(users, (user, id) => {
      let { interestsChips } = user;
      let sessionParticipant = participantsJoined[id];

      if (
        interestsChips &&
        interestsChips.length > 0 &&
        sessionParticipant &&
        sessionParticipant.isOnline
      ) {
        for (let i = 0; i < interestsChips.length; i++) {
          let interest = interestsChips[i].label;
          if (result[interest]) {
            result[interest].count = result[interest].count + 1;
          } else {
            result[interest] = {
              label: interest,
              count: 1
            };
          }
        }
      }
    });

    let sorted = Object.values(result).sort((a, b) => b.count - a.count);

    return sorted;
  }, [users, participantsJoined]);

  // set the default value
  const savedFiltersLabel = Object.keys(filters);
  const [values, setValues] = useState(
    usersInterests.filter((interest) =>
      savedFiltersLabel.includes(interest.label)
    )
  );

  const handleFilterSelected = (interests) => {
    const newFilters = interests.reduce((acc, interest) => {
      acc[interest.label] = true;
      return acc;
    }, {});
    setInternalFilters(newFilters);
    dispatch(setFilters(newFilters));
    setValues(interests);
  };

  const applyFilters = React.useCallback(() => {
    dispatch(setFilters(internalFilters));
    setOpen(false);
  }, [internalFilters, setOpen, dispatch]);

  return (
    <div>
      <DialogClose open={open} onClose={handleClose} maxWidth={"sm"}>
        <div className={classes.content}>
          <Typography variant="h5" color="primary" align="left">
            Filter list of attendees by interest/hobby
          </Typography>

          <FormGroup row style={{ marginTop: 16 }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={usersInterests}
              getOptionLabel={(option) => option.label}
              value={values}
              onChange={(_, value) => {
                handleFilterSelected(value);
              }}
              filterSelectedOptions
              className={classes.autoComplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Interests"
                  placeholder="Select Interests"
                />
              )}
            />
          </FormGroup>

          <Typography
            className={classes.caption}
            variant="caption"
            display="block"
          >
            * The more keywords you add, the more results you will see.
          </Typography>

          <React.Fragment>
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={applyFilters}
              >
                Apply filters
              </Button>
            </div>
          </React.Fragment>
          {/* {participant.id === user.uid && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => history.push(routes.EDIT_PROFILE(routes.EVENT_SESSION(eventSession.id)))}
                >
                  Edit profile
                </Button>
              </div>
            </React.Fragment>
          )} */}
          {/* {(onConferenceRoom || participant.id === user.uid) && <div className={classes.emptySpaceBottom}></div>} */}
        </div>
      </DialogClose>
    </div>
  );
}
