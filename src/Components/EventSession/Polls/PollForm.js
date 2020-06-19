import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Typography
} from "@material-ui/core";
import { getUserId, getSessionId } from "../../../Redux/eventSession";
import { useSelector } from "react-redux";
import { votePoll, POLLS_STATES } from "../../../Modules/pollsOperations";

const PollForm = ({ poll }) => {
  const [value, setValue] = useState(null);
  const userId = useSelector(getUserId);
  const sessionId = useSelector(getSessionId);

  const [disabled, setDisabled] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleVote = () => {
    votePoll(userId, sessionId, poll.id, value);
    setDisabled(true);
  };

  return (
    <Box width="100%">
      <FormControl component="fieldset">
        <RadioGroup name="options" value={value} onChange={handleChange}>
          {poll.options.map((option) => (
            <FormControlLabel
              value={option.id}
              control={<Radio color="primary" />}
              label={<Typography variant="body2">{option.value}</Typography>}
              key={option.id}
              style={{ marginTop: 4, marginBottom: 4 }}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {value && poll.state === POLLS_STATES.PUBLISHED && (
        <Box textAlign="center" mt={2} mb={2} width="100%">
          <Button
            variant="contained"
            color="primary"
            onClick={handleVote}
            disabled={disabled}
          >
            Vote
          </Button>
        </Box>
      )}
    </Box>
  );
};

PollForm.propTypes = {
  poll: PropTypes.object.isRequired
};

export default PollForm;
