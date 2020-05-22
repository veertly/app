import React from "react";
import Alert from "@material-ui/lab/Alert";
import useDeviceDetect from "../../Hooks/useDeviceDetect";

const CompatibilityInfoAlert = ({...props}) => {
  const { message } = useDeviceDetect();
  if (!message) {
    return null;
  }
  return (
    <Alert severity="warning" {...props} >{message}</Alert>
  )
};

export default CompatibilityInfoAlert