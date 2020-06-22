import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import LinkedinIcon from "../../Assets/Icons/Linkedin";
import TwitterIcon from "../../Assets/Icons/Twitter";
import KeybaseIcon from "../../Assets/Icons/Keybase";
import ProfileChips from "../EditProfile/ProfileChips";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import clsx from "clsx";
import { Tooltip, CircularProgress } from "@material-ui/core";
import { uploadProfilePicture } from "../../Modules/storage";
import Flag from "../Misc/Flag";
import Label from "../Misc/Label";
import { ROLES } from "../../Modules/rolesOperations";

const useStyles = makeStyles((theme) => ({
  headlineContainer: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    padding: theme.spacing(1),
    display: "flex"
  },
  headlineContainerNoMargins: {
    display: "flex"
  },
  participantDetails: {
    flexGrow: 1,
    marginLeft: theme.spacing(2)
  },
  topicsInterested: {
    // textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    display: "block",
    maxWidth: 400
    // width: 185
  },
  avatar: {
    marginTop: 1,
    width: 80,
    height: 80,
    fontSize: "2.5rem"
  },
  avatarEditable: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      cursor: "pointer"
    }
  },
  participantName: {
    display: "flex"
  },
  socialNetworkIcon: {
    marginTop: 3,
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main,
      cursor: "pointer"
    }
  },
  companyTitle: {
    margin: theme.spacing(0.5, 2)
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
    zIndex: 2
  },
  role: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5)
  }
}));

export default function (props) {
  const classes = useStyles();

  const { participant, noMargins, editPicture, onPictureChanged } = props;
  const [uploadingPicture, setUploadingPicture] = React.useState(false);
  const [newPicture, setNewPicture] = React.useState(null);
  const CustomTooltip = React.useMemo(
    () => (props) => {
      const { show, children, title, onClick } = props;
      if (!show) {
        return children;
      }
      return (
        <Tooltip title={title}>
          <div
            onClick={onClick ? onClick : () => {}}
            style={{ position: "relative" }}
          >
            {uploadingPicture && (
              <CircularProgress
                size={24}
                color="secondary"
                className={classes.loading}
              />
            )}
            {props.children}
          </div>
        </Tooltip>
      );
    },
    [uploadingPicture, classes.loading]
  );

  if (!participant) {
    return null;
  }

  const hasSubtitle =
    (participant.company && participant.company.trim() !== "") ||
    (participant.companyTitle && participant.companyTitle.trim() !== "");
  const hasChips =
    participant.interestsChips && participant.interestsChips.length > 0;

  const onSelectFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingPicture(true);
      const file = e.target.files[0];
      const result = await uploadProfilePicture(participant.id, file);
      setNewPicture(result.url);
      setUploadingPicture(false);
      if (onPictureChanged) {
        onPictureChanged(result.url);
      }
    }
  };

  const handleAvatarClick = (evt) => {
    var elem = document.getElementById("raised-button-file");
    elem.click();
  };

  return (
    <div
      className={
        noMargins === false
          ? classes.headlineContainer
          : classes.headlineContainerNoMargins
      }
    >
      {editPicture && (
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={onSelectFile}
        />
      )}
      {(participant.avatarUrl || newPicture) && (
        <CustomTooltip
          show={editPicture}
          title="Change picture"
          onClick={handleAvatarClick}
        >
          <Avatar
            alt={participant.firstName}
            src={newPicture ? newPicture : participant.avatarUrl}
            className={clsx(
              classes.avatar,
              editPicture && classes.avatarEditable
            )}
          />
        </CustomTooltip>
      )}
      {!participant.avatarUrl &&
        participant.firstName &&
        participant.firstName.trim() !== "" && (
          <CustomTooltip
            show={editPicture}
            title="Change picture"
            onClick={handleAvatarClick}
          >
            <Avatar
              className={clsx(
                classes.avatar,
                editPicture && classes.avatarEditable
              )}
            >
              {participant.firstName.charAt(0).toUpperCase()}
              {participant.lastName.charAt(0).toUpperCase()}
            </Avatar>
          </CustomTooltip>
        )}
      {!participant.avatarUrl &&
        participant.firstName &&
        participant.firstName.trim() === "" && (
          <CustomTooltip
            show={editPicture}
            title="Change picture"
            onClick={handleAvatarClick}
          >
            <Avatar
              className={clsx(
                classes.avatar,
                editPicture && classes.avatarEditable
              )}
            ></Avatar>
          </CustomTooltip>
        )}
      <div
        className={classes.participantDetails}
        style={{
          paddingTop:
            !hasSubtitle && !hasChips ? 26 : !hasChips || !hasSubtitle ? 16 : 0
        }}
      >
        <div className={classes.participantName}>
          <Typography variant="h6">
            {!participant.firstName || participant.firstName.trim() === ""
              ? "Guest User"
              : `${participant.firstName} ${participant.lastName}`}
          </Typography>

          {participant.linkedinUrl && (
            <a
              href={participant.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className={classes.socialNetworkIcon} />
            </a>
          )}
          {participant.twitterUrl && (
            <a
              href={participant.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className={classes.socialNetworkIcon} />
            </a>
          )}

          {participant.keybaseUrl && (
            <a
              href={participant.keybaseUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <KeybaseIcon className={classes.socialNetworkIcon} />
            </a>
          )}
          {participant.emailPublic &&
            participant.email &&
            participant.email.trim() !== "" && (
              <a
                href={`mailto:${participant.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MailOutlineIcon className={classes.socialNetworkIcon} />
              </a>
            )}
          {participant.roles &&
            participant.roles.length > 0 &&
            participant.roles.map((r) =>
              ROLES[r] ? (
                <Label key={r} className={classes.role} color="primary">
                  {ROLES[r].label}
                </Label>
              ) : null
            )}
        </div>

        {(participant.company || participant.companyTitle) && (
          <Typography
            color="textSecondary"
            /* className={classes.companyTitle} */ className={
              classes.topicsInterested
            }
          >
            {`${participant.companyTitle}${
              participant.company.trim() !== "" &&
              participant.companyTitle.trim() !== ""
                ? " @ "
                : ""
            }${participant.company}`}
          </Typography>
        )}
        {participant.location && (
          <Typography
            color="textSecondary"
            /* className={classes.companyTitle} */ className={
              classes.topicsInterested
            }
          >
            {participant.location}{" "}
            <Flag locationDetails={participant.locationDetails} />
          </Typography>
        )}
        <ProfileChips
          chips={participant.interestsChips}
          showDelete={false}
          smallChips={true}
        />
      </div>
    </div>
  );
}
