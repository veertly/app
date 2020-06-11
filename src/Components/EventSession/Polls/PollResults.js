import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography, useTheme } from "@material-ui/core";

import _ from "lodash";

const PollResults = ({ poll }) => {
  const theme = useTheme();

  const totalVotes = useMemo(() => _.sum(Object.values(poll.votesCounter)), [
    poll.votesCounter
  ]);

  const calculatePercentage = useCallback(
    (numVotes) =>
      totalVotes > 0 ? Math.round((numVotes / totalVotes) * 100) : 0,
    [totalVotes]
  );

  return (
    <Box width="100%">
      {poll.options.map((option) => {
        const numVotes = poll.votesCounter[option.id];
        const percentage = calculatePercentage(numVotes);

        return (
          <Box mt={2} mb={2} key={option.id}>
            <Box display="flex" width="100%">
              <Box flexGrow={1}>
                <Typography variant="body2">{option.value}</Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2">{`(${numVotes}) ${percentage}%`}</Typography>
              </Box>
            </Box>
            <Box
              style={{
                width: `${percentage}%`,
                backgroundColor: theme.palette.secondary.main,
                height: 4
              }}
            ></Box>
          </Box>
        );
      })}
    </Box>
  );
};

PollResults.propTypes = {
  poll: PropTypes.object.isRequired
};

export default PollResults;
