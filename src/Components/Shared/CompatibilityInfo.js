import React from "react";
import Alert from "@material-ui/lab/Alert";
import useDeviceDetect from "../../Hooks/useDeviceDetect";

const CompatibilityInfoAlert = ({ ...props }) => {
  const { message } = useDeviceDetect();
  if (!message) {
    return null;
  }
  return (
    <Alert severity="warning" {...props} style={{ textAlign: "left" }}>
      {message}
    </Alert>
  );
};

export default CompatibilityInfoAlert;
