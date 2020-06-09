import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

import _ from "lodash";
import ReactApexChart from "react-apexcharts";
const chartStaticOptions = {
  chart: {
    type: "bar",
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  dataLabels: {
    enabled: false
  }
  // fill: {
  //   colors: ["#F44336", "#E91E63", "#9C27B0"]
  // }
};

const PollResults = ({ poll }) => {
  const chartsData = useMemo(() => {
    let series = [];
    let labels = [];
    _.forEach(poll.options, (o) => {
      labels.push(o.value);
      series.push(poll.votesCounter[o.id]);
    });

    return {
      options: {
        ...chartStaticOptions,
        xaxis: {
          categories: labels
        }
      },
      series: [{ data: series }]
    };
  }, [poll.options, poll.votesCounter]);

  return (
    <Box width="100%">
      {/* {poll.options.map((option) => (
        <Box>
          {option.value} - {poll.votesCounter[option.id]}
        </Box>
        // <FormControlLabel
        //   value={option.id}
        //   control={<Radio color="primary" />}
        //   label={option.value}
        //   key={option.id}
        // />
      ))} */}

      <ReactApexChart
        options={chartsData.options}
        series={chartsData.series}
        type="bar" /* height={350} */
      />
    </Box>
  );
};

PollResults.propTypes = {
  poll: PropTypes.object.isRequired
};

export default PollResults;
