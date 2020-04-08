import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MUIRichTextEditor from "mui-rte";
import { CardMedia, Button } from "@material-ui/core";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import routes from "../../Config/routes";
import { useHistory } from "react-router-dom";
import { DEFAULT_EVENT_OPEN_MINUTES } from "../../Config/constants";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import MUIAddToCalendar from "../MUIAddToCalendar";
import { convertFromRaw } from "draft-js";
import { getUrl } from "../../Modules/environments";
import { stateToHTML } from "draft-js-export-html";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
    position: "relative",
  },
  ctaContainer: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      textAlign: "center",
      marginTop: 16,
    },
  },
  editButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
}));

export default function EventPage(props) {
  let { bannerUrl, eventBeginDate, eventEndDate, title, description, website, id, eventOpens, owner } = props.event;
  let { isPreview } = props;

  const history = useHistory();

  let beginDate = eventBeginDate ? moment(eventBeginDate.toDate()) : null;
  let endDate = eventEndDate ? moment(eventEndDate.toDate()) : null;

  const classes = useStyles();
  const isSameDay = beginDate ? beginDate.isSame(endDate, "day") : false;

  const [user] = useAuthState(firebase.auth());

  const isLive = React.useMemo(() => {
    if (!eventBeginDate) {
      return true;
    }
    let openMinutes = eventOpens ? Number(eventOpens) : DEFAULT_EVENT_OPEN_MINUTES;
    let beginDate = moment(eventBeginDate.toDate());

    return beginDate.subtract(openMinutes, "minutes").isBefore(moment());
  }, [eventBeginDate, eventOpens]);

  const calendarEvent = React.useMemo(() => {
    const sessionUrl = getUrl() + routes.EVENT_SESSION(id);
    let descriptionText = "";
    if (description) {
      let descriptionContent = convertFromRaw(JSON.parse(description));
      // descriptionText = descriptionContent.getPlainText("\n\n");
      descriptionText = stateToHTML(descriptionContent);
    }
    return {
      id,
      title,
      description: descriptionText,
      location: sessionUrl,
      startTime: beginDate,
      endTime: endDate,
    };
  }, [id, description, title, beginDate, endDate]);

  return (
    <Card className={classes.root}>
      {!isPreview && user && user.uid === owner && (
        <Button
          variant="outlined"
          color="secondary"
          disableElevation
          onClick={() => history.push(routes.EDIT_EVENT_SESSION(id))}
          className={classes.editButton}
        >
          Edit Event
        </Button>
      )}
      {bannerUrl && bannerUrl.trim() !== "" && (
        <CardMedia component="img" alt={title} image={bannerUrl} title={title} />
      )}
      {(!bannerUrl || bannerUrl.trim() === "") && (
        <CardMedia component="img" alt={title} image="/DefaultEventBanner.svg" title={title} />
      )}
      <div style={{ padding: 32 }}>
        <Typography variant="h4" color="primary" align="left" style={{ marginBottom: 24 }}>
          {title}
        </Typography>

        <Grid container justify="space-between" className={classes.textField}>
          <div style={{ marginRigth: 16 }}>
            {beginDate && (
              <Typography color="textSecondary">
                <span role="img" aria-label="calendar">
                  📅
                </span>
                {isSameDay
                  ? beginDate.format("lll") + " to " + endDate.format("LT")
                  : beginDate.format("lll") + " to " + endDate.format("lll")}
              </Typography>
            )}
            {website && website.trim() !== "" && (
              <Typography color="textSecondary">
                <a href={website} target="_blank">
                  <span role="img" aria-label="website">
                    🔗
                  </span>
                  {website}
                </a>
              </Typography>
            )}
          </div>
          <div className={classes.ctaContainer}>
            {!isLive && <MUIAddToCalendar event={calendarEvent} />}
            {isLive && (
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => history.push(routes.EVENT_SESSION_LIVE(id))}
              >
                Go to the event
              </Button>
            )}
          </div>
        </Grid>
        {description && description.trim() !== "" && (
          <div style={{ marginTop: 24 }}>
            <MUIRichTextEditor
              value={description}
              readOnly={true}
              placeholder="No description available"
              toolbar={false}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
