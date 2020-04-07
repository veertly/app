/* eslint-disable no-undef */
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import EnvironmentRibbon from "../Topbar/EnvironmentRibbon";

const Page = (props) => {
  const { title, children, ...rest } = props;

  return (
    <React.Fragment>
      <EnvironmentRibbon />
      <div {...rest}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {children}
      </div>
    </React.Fragment>
  );
};

Page.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Page;
