import React from "react";

import TextField from "@material-ui/core/TextField";

const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
const OutlinedDiv = ({ children, label, ...rest }) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent
      }}
      margin="dense"
      inputProps={{ children: children }}
      {...rest}
      style={{ paddingTop: 0 }}
    />
  );
};
export default OutlinedDiv;
