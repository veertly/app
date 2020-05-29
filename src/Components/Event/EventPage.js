import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MUIRichTextEditor from "mui-rte";
import { CardMedia, Button } from "@material-ui/core";
import * as moment from "moment";
import routes from "../../Config/routes";
import { useHistory, useLocation } from "react-router-dom";
import {
  DEFAULT_EVENT_OPEN_MINUTES,
  DEFAULT_EVENT_CLOSES_MINUTES
} from "../../Config/constants";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../Modules/firebaseApp";
import MUIAddToCalendar from "../MUIAddToCalendar";
import { convertFromRaw } from "draft-js";
import { getUrl } from "../../Modules/environments";
import { stateToHTML } from "draft-js-export-html";
import JoinEventIcon from "@material-ui/icons/MeetingRoom";
import RegisterIcon from "@material-ui/icons/HowToReg";
import { getFeatureDetails, FEATURES } from "../../Modules/features";
import EventRegistrationForm from "./EventRegistrationForm";
import { userRegisteredEvent } from "../../Modules/eventsOperations";
import SuccessIcon from "@material-ui/icons/CheckCircleOutline";
import Alert from "@material-ui/lab/Alert";
import CompatibilityInfoAlert from "../Shared/CompatibilityInfo";
import MarginProvider from "../Shared/MarginProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
    position: "relative"
  },
  contentContainer: ({ isSmallContainer }) => ({
    padding: isSmallContainer ? 16 : 32,
    [theme.breakpoints.down("xs")]: {
      padding: 20
    }
  }),
  ctaContainer: {
    // [theme.breakpoints.down("xs")]: {},
    width: "100%",
    textAlign: "center",
    marginTop: 16
  },
  joinButton: {
    height: 48
  },
  editButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2)
  },
  registerButton: {
    marginBottom: theme.spacing(1)
  },
  dialogContent: {
    padding: theme.spacing(3)
  }
}));

export default function EventPage(props) {
  let {
    bannerUrl,
    eventBeginDate,
    eventEndDate,
    title,
    description,
    website,
    id,
    eventOpens,
    eventCloses,
    owner
  } = props.event;
  let {
    isPreview,
    hideButtons,
    enabledFeatures,
    isSmallContainer,
    hideBanner
  } = props;
  const classes = useStyles({ isSmallContainer });

  const history = useHistory();

  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(
    userRegisteredEvent(id)
  );

  let beginDate = eventBeginDate ? moment(eventBeginDate.toDate()) : null;
  let endDate = eventEndDate ? moment(eventEndDate.toDate()) : null;

  const isSameDay = beginDate ? beginDate.isSame(endDate, "day") : false;

  const [user] = useAuthState(firebase.auth());

  const websiteNormalized = website.includes("http")
    ? website
    : `https://${website}`;

  const isLive = React.useMemo(() => {
    if (!eventBeginDate) {
      return true;
    }
    let openMinutes = eventOpens
      ? Number(eventOpens)
      : DEFAULT_EVENT_OPEN_MINUTES;
    let beginDate = moment(eventBeginDate.toDate());

    return beginDate.subtract(openMinutes, "minutes").isBefore(moment());
  }, [eventBeginDate, eventOpens]);

  const isOver = React.useMemo(() => {
    if (!eventEndDate) {
      return true;
    }
    let closeMinutes = eventCloses
      ? Number(eventCloses)
      : DEFAULT_EVENT_CLOSES_MINUTES;
    let endDate = moment(eventEndDate.toDate());

    return endDate.add(closeMinutes, "minutes").isBefore(moment());
  }, [eventCloses, eventEndDate]);

  const calendarEvent = React.useMemo(() => {
    const sessionUrl = getUrl() + routes.EVENT_SESSION(id);
    let descriptionText = "";
    let rawDescription = "";
    if (description) {
      const parsedDescription = JSON.parse(description);
      let descriptionContent = convertFromRaw(parsedDescription);
      rawDescription = parsedDescription.blocks.reduce((acc, item) => {
        acc += item.text;
        return acc;
      }, "");
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
      rawDescription
    };
  }, [id, description, title, beginDate, endDate]);

  const hasRsvpEnabled = React.useMemo(
    () => getFeatureDetails(enabledFeatures, FEATURES.RSVP) !== null,
    [enabledFeatures]
  );
  const rsvpProperties = React.useMemo(
    () => getFeatureDetails(enabledFeatures, FEATURES.RSVP),
    [enabledFeatures]
  );

  const ticketsProperties = React.useMemo(() => {
    const ticketsDetails = getFeatureDetails(enabledFeatures, FEATURES.TICKETS);
    return ticketsDetails && ticketsDetails.enabled === true
      ? ticketsDetails
      : null;
  }, [enabledFeatures]);
  const hasTicketsEnabled = React.useMemo(() => ticketsProperties !== null, [
    ticketsProperties
  ]);

  const isPrivateEvent = React.useMemo(() => {
    const passwordProtected = getFeatureDetails(
      enabledFeatures,
      FEATURES.PASSWORD_PROTECTED
    );
    return (
      passwordProtected &&
      passwordProtected.enabled &&
      passwordProtected.showOnEventPage === true
    );
  }, [enabledFeatures]);


  const previewUrl =  !bannerUrl || bannerUrl.trim() === "" ? "/DefaultEventBanner.svg" : bannerUrl;

  const location = useLocation(); 
  const pageUrl = getUrl + location.pathname;

  return (
    <Card className={classes.root}>
      <Helmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content="" />

        <meta property="og:type" content="website"/>
        <meta property="og:url" content={pageUrl}/>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content=""/>
        <meta property="og:image" content={previewUrl}/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content={pageUrl}/>
        <meta property="twitter:title" content={title}/>
        <meta property="twitter:description" content=""/>
        <meta property="twitter:image" content={previewUrl}></meta>
      </Helmet>
      {!isPreview && user && user.uid === owner && (
        <Button
          variant="outlined"
          color="secondary"
          disableElevation
          onClick={() => history.push(routes.EDIT_EVENT_SESSION(id))}
          className={classes.editButton}
          style={{ backgroundColor: "rgba(92, 219, 148, 0.5)", color: "#fff" }}
        >
          Edit Event
        </Button>
      )}
      {!hideBanner && (
        <>
          {bannerUrl && bannerUrl.trim() !== "" && (
            <CardMedia
              component="img"
              alt={title}
              image={bannerUrl}
              title={title}
            />
          )}
          {(!bannerUrl || bannerUrl.trim() === "") && (
            <CardMedia
              component="img"
              alt={title}
              image="/DefaultEventBanner.svg"
              title={title}
            />
          )}
        </>
      )}
      <div className={classes.contentContainer}>
        <Typography
          variant="h4"
          color="primary"
          align="left"
          // style={{ marginBottom: 24 }}
        >
          {title}
        </Typography>

        {/* <Grid container justify="space-between" className={classes.textField}> */}
        <div style={{ marginRight: 8, marginTop: 24 }}>
          {beginDate && (
            <Typography color="textSecondary">
              <span
                role="img"
                aria-label="calendar"
                style={{ marginRight: isSmallContainer ? 4 : 16 }}
              >
                📅
              </span>
              {isSameDay
                ? beginDate.format("lll") + " to " + endDate.format("LT")
                : beginDate.format("lll") + " to " + endDate.format("lll")}
            </Typography>
          )}
          {website && website.trim() !== "" && (
            <Typography color="textSecondary">
              <a
                href={websiteNormalized}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  role="img"
                  aria-label="website"
                  style={{ marginRight: 16 }}
                >
                  🔗
                </span>
                {website}
              </a>
            </Typography>
          )}

          {hasTicketsEnabled && (
            <Typography color="textSecondary">
              <span role="img" aria-label="price" style={{ marginRight: 16 }}>
                💰
              </span>
              {ticketsProperties.label}
            </Typography>
          )}
          {isPrivateEvent && (
            <Typography color="textSecondary">
              <span role="img" aria-label="price" style={{ marginRight: 16 }}>
                🔒
              </span>
              This is a private event
            </Typography>
          )}
        </div>

        {!hideButtons && (
          <div className={classes.ctaContainer}>
            {!isLive && !isOver && (
              <div>
                {hasRsvpEnabled && !isRegistered && (
                  <Button
                    variant="contained"
                    color="primary"
                    // disableElevation
                    onClick={() => setRegisterOpen(true)}
                    size="large"
                    startIcon={<RegisterIcon />}
                    className={classes.registerButton}
                  >
                    Register
                  </Button>
                )}
                {hasRsvpEnabled && isRegistered && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: " center",
                      alignItems: "center",
                      color: "green",
                      marginBottom: 8
                    }}
                  >
                    <span style={{ paddingRight: 8, paddingTop: 4 }}>
                      <SuccessIcon />
                    </span>
                    <Typography>
                      You have already registered to this event
                    </Typography>
                  </div>
                )}
                <MUIAddToCalendar
                  event={calendarEvent}
                  isPrimaryButton={!hasRsvpEnabled}
                />
              </div>
            )}
            {isLive && !isOver && (
              <Button
                variant="contained"
                color="primary"
                // disableElevation
                onClick={() => history.push(routes.EVENT_SESSION_LIVE(id))}
                size="large"
                startIcon={<JoinEventIcon />}
                className={classes.joinButton}
              >
                Join event now
              </Button>
            )}

            <MarginProvider top={16}>
              <CompatibilityInfoAlert />
            </MarginProvider>

            {isOver && (
              <div
                style={{
                  display: "flex",
                  justifyContent: " center",
                  alignItems: "center",
                  color: "green",
                  marginBottom: 8
                }}
              >
                {/* <span style={{ paddingRight: 8, paddingTop: 4 }}>
                  <SuccessIcon />
                </span>
                <Typography>This event has finished!</Typography> */}
                <Alert severity="info">This event has finished</Alert>
              </div>
            )}
          </div>
        )}

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
      {hasRsvpEnabled && (
        <Dialog
          onClose={() => {
            setRegisterOpen(false);
            setIsRegistered(userRegisteredEvent(id));
          }}
          open={registerOpen}
          scroll={"body"}
        >
          <div className={classes.dialogContent}>
            <EventRegistrationForm
              eventSession={props.event}
              rsvpProperties={rsvpProperties}
              onClose={() => {
                setRegisterOpen(false);
                setIsRegistered(userRegisteredEvent(id));
              }}
            />
          </div>
        </Dialog>
      )}
    </Card>
  );
}
