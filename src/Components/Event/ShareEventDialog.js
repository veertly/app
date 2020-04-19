import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import { closeShare, isShareOpen } from "../../Redux/dialogs";
import { getUrl } from "../../Modules/environments";
import routes from "../../Config/routes";
import { Typography, Tooltip, IconButton } from "@material-ui/core";
import EventShareIcons from "./EventShareIcons";
import CopyIcon from "@material-ui/icons/FileCopy";
import { useSnackbar } from "material-ui-snackbar-provider";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getEventSessionDetails, getSessionId } from "../../Redux/eventSession";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    padding: 48,
  },
}));

export default function (props) {
  const classes = useStyles();

  const open = useSelector(isShareOpen);

  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  const sessionId = useSelector(getSessionId);

  const handleClose = () => {
    dispatch(closeShare());
  };

  const shareText = React.useMemo(
    () => `Join me in the virtual event ${eventSessionDetails.title} that is LIVE NOW on @veertly `,
    [eventSessionDetails.title]
  );

  const link = React.useMemo(() => getUrl() + routes.EVENT_SESSION(sessionId), [sessionId]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} scroll={"body"}>
        <div className={classes.content}>
          <Typography variant="h5" color="primary" align="center">
            {eventSessionDetails.title}
          </Typography>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 8 }}>
            <Typography align="center">
              <a href={link}>{link}</a>
            </Typography>
            <Tooltip title="Copy event link">
              <CopyToClipboard text={link} onCopy={() => snackbar.showMessage("Event link copied")}>
                <IconButton aria-label="copy" style={{ marginLeft: 8 }} size="small" color="primary">
                  <CopyIcon fontSize="inherit" />
                </IconButton>
              </CopyToClipboard>
            </Tooltip>
          </div>
          {eventSessionDetails && (
            <EventShareIcons
              url={getUrl() + routes.EVENT_SESSION(eventSessionDetails.originalId)}
              shareText={shareText}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}
