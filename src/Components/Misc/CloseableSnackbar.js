import React from "react";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default ({ message, action, ButtonProps, SnackbarProps }) => {
  return (
    <Snackbar
      {...SnackbarProps}
      message={message}
      action={
        <>
          {action != null && (
            <Button color="secondary" size="small" {...ButtonProps}>
              {action}
            </Button>
          )}
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={SnackbarProps.onClose}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
    />
  );
};
