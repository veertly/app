import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography, useTheme } from "@material-ui/core";

import _ from "lodash";

const PollResults = ({ poll }) => {
  const theme = useTheme();
  // const chartsData = useMemo(() => {
  //   let series = [];
  //   let labels = [];
  //   _.forEach(poll.options, (o) => {
  //     labels.push(o.value);
  //     series.push(poll.votesCounter[o.id]);
  //   });

  //   return {
  //     options: {
  //       ...chartStaticOptions,
  //       xaxis: {
  //         categories: labels
  //       }
  //     },
  //     series: [{ data: series }]
  //   };
  // }, [poll.options, poll.votesCounter]);

  const totalVotes = useMemo(() => _.sum(Object.values(poll.votesCounter)), [
    poll.votesCounter
  ]);

  // const winnerId = useMemo(() => {
  //   let winner = null;
  //   let winnerVotes = 0;
  //   _.forEach(poll.votesCounter, (numVotes, id) => {
  //     if (numVotes > winnerVotes) {
  //       winner = id;
  //       winnerVotes = numVotes;
  //     }
  //   });
  //   return winner;
  // }, [poll.votesCounter]);
  const calculatePercentage = useCallback(
    (numVotes) =>
      totalVotes > 0 ? Math.round((numVotes / totalVotes) * 100) : 0,
    [totalVotes]
  );

  // const totalCalculated = useMemo(
  //   () =>
  //     _.reduce(
  //       Object.values(poll.votesCounter),
  //       (sum, count) => sum + calculatePercentage(count),
  //       0
  //     ),
  //   [calculatePercentage, poll.votesCounter]
  // );
  return (
    <Box width="100%">
      {poll.options.map((option) => {
        const numVotes = poll.votesCounter[option.id];
        const percentage = calculatePercentage(numVotes);
        // console.log({ percentage, totalVotes });
        // const isLast = index === poll.options.length - 1;
        // if (isLast && totalCalculated < 100) {
        //   percentage = percentage + (100 - totalCalculated);
        // } else if (isLast && totalCalculated > 100) {
        //   percentage = percentage - (totalCalculated - 100);
        // }
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

      {/* <ReactApexChart
        options={chartsData.options}
        series={chartsData.series}
        type="bar" 

      /> */}
    </Box>
  );
};

PollResults.propTypes = {
  poll: PropTypes.object.isRequired
};

export default PollResults;
