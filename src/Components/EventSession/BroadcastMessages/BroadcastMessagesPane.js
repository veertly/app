import React, { useContext, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  makeStyles
} from "@material-ui/core";
import { getUserId, getSessionId } from "../../../Redux/eventSession";
import { useSelector } from "react-redux";
import BroadcastDialogManager from "./BroadcastDialogManager";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";
import BroadcastMessagesContext from "../../../Contexts/BroadcastMessagesContext";
import { BROADCAST_MESSAGE_STATES } from "../../../Modules/broadcastOperations";
// import DraftIcon from "../../../Assets/Icons/Draft";
import BroadcastMessagesMenu from "./BroadcastMessagesMenu";
// import { Archive as ArchiveIcon } from "react-feather";
import LiveIcon from "../../../Assets/Icons/Live";
import { Alert } from "@material-ui/lab";
import Label from "../../Misc/Label";

const useStyles = makeStyles({
  divider: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 16,
    marginRight: 16
  },
  alert: {
    // marginTop: 16
  },
  liveIcon: {
    animation: "$ripple 1.2s infinite ease-in-out"
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.6)",
      opacity: 1
    },
    "100%": {
      transform: "scale(1.5)",
      opacity: 0
    }
  },
  label: { marginLeft: 8 }
});

const BroadcastMessageItem = ({
  broadcastMessage,
  showMenu = true,
  showPublish = true,
  isActiveMessage = false
}) => {
  const classes = useStyles();

  const color = React.useMemo(() => {
    if (broadcastMessage.state === BROADCAST_MESSAGE_STATES.DRAFT) {
      return "textSecondary";
    } else if (isActiveMessage) {
      return "secondary";
    } else {
      return "textPrimary";
    }
  }, [broadcastMessage.state, isActiveMessage]);

  const isDraft = React.useMemo(
    () => broadcastMessage.state === BROADCAST_MESSAGE_STATES.DRAFT,
    [broadcastMessage.state]
  );

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingLeft={2}
      paddingRight={2}
    >
      <Box display="flex" alignContent="center">
        {isActiveMessage ? (
          <Box mr={1}>
            <LiveIcon color="secondary" className={classes.liveIcon} />
            {/* <AvailableBadge /> */}
          </Box>
        ) : null}
        <Typography color={color}>
          {broadcastMessage.message}
          {isDraft && (
            // <Box ml={1}>
            <Label className={classes.label} color="grey">
              draft
            </Label>
            // </Box>
          )}
        </Typography>
        {/* {isDraft && (
          <Box ml={1}>
            <Label color="grey">draft</Label>
          </Box>
        )} */}
      </Box>
      {showMenu && (
        <Box alignSelf="flex-start">
          <BroadcastMessagesMenu
            showPublish={showPublish}
            broadcastMessage={broadcastMessage}
          />
        </Box>
      )}
    </Box>
  );
};

const LocalDivider = () => {
  const classes = useStyles();
  return <Divider className={classes.divider}></Divider>;
};

const sortMessagesByTime = (a, b) => {
  return Number(b.id) - Number(a.id);
};

const BroadcastMessagePane = () => {
  // const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  // const isUserEventOwner = useSelector(isEventOwner);
  const userId = useSelector(getUserId);
  const sessionId = useSelector(getSessionId);

  const { setCreateBroadcastDialog } = useContext(BroadcastDialogContext);

  const { broadcastMessages, activeBroadcastMessage } = useContext(
    BroadcastMessagesContext
  );

  const sortedMessages = useMemo(() => {
    return broadcastMessages ? broadcastMessages.sort(sortMessagesByTime) : [];
  }, [broadcastMessages]);

  const classes = useStyles();

  return (
    <>
      <BroadcastDialogManager sessionId={sessionId} userId={userId} />
      <Box
        paddingLeft={2}
        paddingRight={2}
        marginTop={2}
        width="100%"
        flexDirection="column"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {!activeBroadcastMessage && (
          <Button
            disabled={!!activeBroadcastMessage}
            onClick={() => setCreateBroadcastDialog(true)}
            variant="contained"
            color="primary"
          >
            Create Broadcast
          </Button>
        )}
        {!!activeBroadcastMessage && (
          <Alert className={classes.alert} severity="info">
            Cannot publish while there is a live broadcast
          </Alert>
        )}
      </Box>
      <Box mt={2}>
        {sortedMessages.length > 0 && (
          <>
            {sortedMessages.map((message, index) => {
              return (
                <Box key={message.id}>
                  <BroadcastMessageItem
                    broadcastMessage={message}
                    showPublish={!activeBroadcastMessage}
                    isActiveMessage={
                      activeBroadcastMessage &&
                      activeBroadcastMessage.id === message.id
                    }
                  />
                  {index !== sortedMessages.length - 1 && <LocalDivider />}
                </Box>
              );
            })}
          </>
        )}
      </Box>
    </>
  );
};

export default BroadcastMessagePane;
