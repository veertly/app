import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MUIRichTextEditor from "mui-rte";
import { CardMedia } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
  },
}));

export default function EventPage(props) {
  let { bannerUrl, beginDate, endDate, title, description, website } = props.event;

  const classes = useStyles();
  const isSameDay = beginDate.isSame(endDate, "day");

  return (
    <Card className={classes.root}>
      {bannerUrl && bannerUrl.trim() !== "" && (
        <CardMedia component="img" alt={title} image={bannerUrl} title={title} />
      )}
      {(!bannerUrl || bannerUrl.trim() === "") && (
        <CardMedia component="img" alt={title} image="/DefaultEventBanner.svg" title={title} />
      )}
      <div style={{ padding: 32 }}>
        <Typography variant="h4" color="primary" align="left" gutterBottom>
          {title}
        </Typography>
        <Typography color="textSecondary">
          <span role="img" aria-label="calendar">
            📅
          </span>
          {isSameDay
            ? beginDate.format("lll") + " to " + endDate.format("LT")
            : beginDate.format("lll") + " to " + endDate.format("lll")}
        </Typography>
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
        {description && description.trim() !== "" && (
          <MUIRichTextEditor
            value={description}
            readOnly={true}
            placeholder="No description available"
            toolbar={false}
          />
        )}
      </div>
    </Card>
  );
}
