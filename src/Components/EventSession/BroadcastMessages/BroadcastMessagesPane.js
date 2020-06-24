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
// import LiveIcon from "../../../Assets/Icons/Live";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles({
  divider: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16
  },
  alert: {
    marginTop: 16
  }
});

const BroadcastMessageItem = ({
  broadcastMessage,
  showMenu = true,
  showPublish = true
}) => {
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
      <Typography>{broadcastMessage.message}</Typography>
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

// const sortMessagesByTime = (a,b) => a.

const BroadcastMessagePane = () => {
  // const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  // const isUserEventOwner = useSelector(isEventOwner);
  const userId = useSelector(getUserId);
  const sessionId = useSelector(getSessionId);

  const { setCreateBroadcastDialog } = useContext(BroadcastDialogContext);

  const { broadcastMessages, activeBroadcastMessage } = useContext(
    BroadcastMessagesContext
  );

  // const sortedMessages = useMemo(() => {
  //   return broadcastMessages
  //     ? broadcastMessages.sort( (a, b) => {
  //       const isDraftA = a.state === BROADCAST_MESSAGE_STATES.DRAFT;
  //       const isDraftB = a.state === BROADCAST_MESSAGE_STATES.DRAFT;
  //     }
  //       (
  //         (message) => message.state === BROADCAST_MESSAGE_STATES.PUBLISHED
  //       )
  //     : [];
  // }, [broadcastMessages]);

  const publishedMessages = useMemo(() => {
    return broadcastMessages
      ? broadcastMessages.filter(
          (message) => message.state === BROADCAST_MESSAGE_STATES.PUBLISHED
        )
      : [];
  }, [broadcastMessages]);

  const draftMessages = useMemo(() => {
    return broadcastMessages
      ? broadcastMessages.filter(
          (message) => message.state === BROADCAST_MESSAGE_STATES.DRAFT
        )
      : [];
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
        <Button
          disabled={!!activeBroadcastMessage}
          onClick={() => setCreateBroadcastDialog(true)}
          variant="contained"
          color="primary"
        >
          Create Broadcast
        </Button>
        {!!activeBroadcastMessage && (
          <Alert className={classes.alert} severity="info">
            Cannot publish while there is a live broadcast. Please wait 40
            seconds
          </Alert>
        )}
      </Box>
      <Box>
        <>
          {/* <Box m={2} marginTop={1} display="flex">
            <LiveIcon color="primary" style={{ marginRight: 8 }} />
            <Typography variant="button" color="primary">
              Live Messages
            </Typography>
          </Box>  */}
          {activeBroadcastMessage && (
            <>
              <BroadcastMessageItem
                key={activeBroadcastMessage.id}
                broadcastMessage={activeBroadcastMessage}
                showMenu={false}
              />
              <LocalDivider />
            </>
          )}
          {/* {
            !activeBroadcastMessage && (
              <Box paddingLeft={2} paddingRight={2}>
                <Typography>
                  No active broadcast messages
                </Typography>
              </Box> 
            )
          } */}
        </>

        {draftMessages.length > 0 && (
          <>
            {/* <Box m={2} mt={6} display="flex">
              <SvgIcon color="primary" style={{ marginRight: 8 }}>
                <DraftIcon />
              </SvgIcon>
              <Typography variant="button" color="primary">
                Draft Messages
              </Typography>
            </Box> */}
            {draftMessages.map((message, index) => {
              return (
                <Box key={message.id}>
                  <BroadcastMessageItem
                    broadcastMessage={message}
                    showPublish={!activeBroadcastMessage}
                  />
                  {index !== draftMessages.length - 1 && <LocalDivider />}
                </Box>
              );
            })}
          </>
        )}

        {publishedMessages.length > 0 && (
          <>
            {/* <Box m={2} mt={6} display="flex">
              <SvgIcon color="primary" style={{ marginRight: 8 }}>
                <ArchiveIcon />
              </SvgIcon>
              <Typography variant="button" color="primary">
                Published Messages
              </Typography>
            </Box> */}
            {publishedMessages.map((message, index) => {
              return (
                <Box key={message.id}>
                  <BroadcastMessageItem
                    broadcastMessage={message}
                    showPublish={!activeBroadcastMessage}
                  />
                  {index !== publishedMessages.length - 1 && <LocalDivider />}
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
