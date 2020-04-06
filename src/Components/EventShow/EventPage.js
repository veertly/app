import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MUIRichTextEditor from "mui-rte";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    width: "100%",
    margin: "auto",
  },
}));

export default function EventPage(props) {
  let { bannerUrl, liveAt, title, description, website } = props.event;
  console.log({ bannerUrl, liveAt, title, description, website });
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      {/* <CardMedia component="img" alt={title} height="232" image={bannerUrl} title={title} /> */}
      {bannerUrl && bannerUrl.trim() !== "" && <img style={{ width: "100%" }} src={bannerUrl} alt={title} />}
      {(!bannerUrl || bannerUrl.trim() === "") && (
        <img style={{ width: "100%" }} src="/DefaultEventBanner.svg" alt={title} />
      )}
      <div style={{ padding: 32 }}>
        <Typography variant="h5" color="primary" align="left" gutterBottom>
          {title}
        </Typography>
        <Typography color="textSecondary">
          <span role="img" aria-label="calendar">
            📅
          </span>
          {liveAt.format("llll")}
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
