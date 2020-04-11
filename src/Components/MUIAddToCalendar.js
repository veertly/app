import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import { blue } from "@material-ui/core/colors";
import moment from "moment";
import { isMobile } from "../Utils/device";
import CalendarIcon from "@material-ui/icons/Event";
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  icon: {
    maxWidth: 40,
    maxHeight: 35,
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open, event } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const getRandomKey = () => {
    let n = Math.floor(Math.random() * 999999999999).toString();
    return new Date().getTime().toString() + "_" + n;
  };

  const formatTime = (date) => {
    return date.format("YYYYMMDDTHHmmss");
    // return formattedDate.replace("+00:00", "Z");
  };

  const calculateDuration = (startTime, endTime) => {
    // snag parameters and format properly in UTC
    let end = endTime.format("DD/MM/YYYY HH:mm:ss");
    let start = startTime.format("DD/MM/YYYY HH:mm:ss");

    // calculate the difference in milliseconds between the start and end times
    let difference = moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"));

    // convert difference from above to a proper momentJs duration object
    let duration = moment.duration(difference);

    return Math.floor(duration.asHours()) + moment.utc(difference).format(":mm");
  };
  const buildUrl = (type) => {
    let calendarUrl = "";

    // allow mobile browsers to open the gmail data URI within native calendar app
    // type = (type == "google" && this.isMobile()) ? "outlook" : type;
    switch (type) {
      case "google":
        calendarUrl = "https://calendar.google.com/calendar/render";
        calendarUrl += "?action=TEMPLATE";
        calendarUrl += "&dates=" + formatTime(event.startTime);
        calendarUrl += "/" + formatTime(event.endTime);
        calendarUrl += "&location=" + encodeURIComponent(event.location);
        calendarUrl += "&text=" + encodeURIComponent(event.title);
        calendarUrl += "&details=" + encodeURIComponent(event.description);
        break;

      case "yahoo":
        // yahoo doesn't utilize endTime so we need to calulate duration
        let duration = calculateDuration(event.startTime, event.endTime);
        calendarUrl = "https://calendar.yahoo.com/?v=60&view=d&type=20";
        calendarUrl += "&title=" + encodeURIComponent(event.title);
        calendarUrl += "&st=" + formatTime(event.startTime);
        calendarUrl += "&dur=" + duration;
        calendarUrl += "&desc=" + encodeURIComponent(event.description);
        calendarUrl += "&in_loc=" + encodeURIComponent(event.location);
        break;

      case "outlookcom":
        calendarUrl = "https://outlook.live.com/owa/?rru=addevent";
        calendarUrl += "&startdt=" + formatTime(event.startTime);
        calendarUrl += "&enddt=" + formatTime(event.endTime);
        calendarUrl += "&subject=" + encodeURIComponent(event.title);
        calendarUrl += "&location=" + encodeURIComponent(event.location);
        calendarUrl += "&body=" + encodeURIComponent(event.description);
        calendarUrl += "&allday=false";
        calendarUrl += "&uid=" + getRandomKey();
        calendarUrl += "&path=/calendar/view/Month";
        break;

      default:
        calendarUrl = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          "URL:" + document.URL,
          "DTSTART:" + formatTime(event.startTime),
          "DTEND:" + formatTime(event.endTime),
          "SUMMARY:" + event.title,
          "DESCRIPTION:" + event.description,
          "LOCATION:" + event.location,
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\n");
    }

    return calendarUrl;
  };

  const handleListItemClick = (type) => {
    let url = buildUrl(type);
    console.log(url);

    if (!isMobile() && (url.startsWith("data") || url.startsWith("BEGIN"))) {
      let filename = "download.ics";
      let blob = new Blob([url], { type: "text/calendar;charset=utf-8" });

      /****************************************************************
        // many browsers do not properly support downloading data URIs
        // (even with "download" attribute in use) so this solution
        // ensures the event will download cross-browser
        ****************************************************************/
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute(event.id, filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank");
    }
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      {/* <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle> */}
      <List>
        <ListItem button onClick={() => handleListItemClick("google")}>
          <ListItemAvatar>
            {/* <Avatar className={classes.avatar}> */}
            {/* <FontAwesomeIcon icon={faGoogle} /> */}
            {/* </Avatar> */}
            <img src="/icons/calendar/google-calendar.svg" alt="Google Calendar" className={classes.icon} />
          </ListItemAvatar>
          <ListItemText primary={"Google"} />
        </ListItem>

        <ListItem button onClick={() => handleListItemClick("outlookcom")}>
          <ListItemAvatar>
            <img src="/icons/calendar/outlook.svg" alt="Outlook" className={classes.icon} />
          </ListItemAvatar>
          <ListItemText primary={"Outlook"} />
        </ListItem>

        <ListItem button onClick={() => handleListItemClick("yahoo")}>
          <ListItemAvatar>
            <img src="/icons/calendar/yahoo.svg" alt="Outlook" className={classes.icon} />
          </ListItemAvatar>
          <ListItemText primary={"Yahoo"} />
        </ListItem>

        <ListItem button onClick={() => handleListItemClick("download")}>
          <ListItemAvatar>
            <img src="/icons/calendar/default-calendar.svg" alt="Outlook" className={classes.icon} />
          </ListItemAvatar>
          <ListItemText primary={"Download .ics"} />
        </ListItem>

        {/* <ListItem autoFocus button onClick={() => handleListItemClick("addAccount")}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem> */}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default function MUIAddToCalendar(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant={props.isPrimaryButton ? "outlined" : "text"}
        color="primary"
        onClick={handleClickOpen}
        startIcon={<CalendarIcon />}
      >
        Add to calendar
      </Button>
      <SimpleDialog open={open} onClose={handleClose} event={props.event} />
    </div>
  );
}
