/* eslint-disable no-undef */
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import EnvironmentRibbon from "../Topbar/EnvironmentRibbon";

// import useRouter from 'utils/useRouter';

const REACT_ENV = process.env.REACT_APP_ENV;
console.log(REACT_ENV);

const Page = props => {
  const { title, children, ...rest } = props;

  // const router = useRouter();

  // useEffect(() => {
  //   if (NODE_ENV !== 'production') {
  //     return;
  //   }

  //   if (window.gtag) {
  //     window.gtag('config', GA_MEASUREMENT_ID, {
  //       page_path: router.location.pathname,
  //       page_name: title
  //     });
  //   }
  // }, [title, router]);

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
  title: PropTypes.string
};

export default Page;
