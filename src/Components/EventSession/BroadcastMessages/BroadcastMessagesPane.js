import React, { useContext, useMemo } from "react";
import { Box, Button, SvgIcon, Typography, Divider, makeStyles } from "@material-ui/core";
import { getUserId, getSessionId } from "../../../Redux/eventSession";
import { useSelector } from "react-redux";
import BroadcastDialogManager from "./BroadcastDialogManager";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";
import BroadcastMessagesContext from "../../../Contexts/BroadcastMessagesContext";
import { BROADCAST_MESSAGE_STATES } from "../../../Modules/broadcastOperations";
import DraftIcon from "../../../Assets/Icons/Draft";
import BroadcastMessagesMenu from "./BroadcastMessagesMenu";
import { Archive as ArchiveIcon } from "react-feather";
import LiveIcon from "../../../Assets/Icons/Live";

const useStyles = makeStyles({
  divider: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
  }
})

const BroadcastMessageItem = ({ broadcastMessage }) => {

  return (
    <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" paddingLeft={2} paddingRight={2}>
      <Typography>
        {broadcastMessage.message}
      </Typography>
      <Box alignSelf="flex-start">
        <BroadcastMessagesMenu broadcastMessage={broadcastMessage} />
      </Box>
    </Box>
  )
}

const LocalDivider = () => {
  const classes = useStyles();
  return (
    <Divider className={classes.divider}>

    </Divider>
  )
}

const BroadcastMessagePane = () => {
  // const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  // const isUserEventOwner = useSelector(isEventOwner);
  const userId = useSelector(getUserId);
  const sessionId = useSelector(getSessionId);

  const {
    setCreateBroadcastDialog,
    activeBroadcastMessage
  } = useContext(BroadcastDialogContext)

  const {
    broadcastMessages,
  } = useContext(BroadcastMessagesContext);
  
  const publishedMessages = useMemo(() => {
    return broadcastMessages ? broadcastMessages.filter(message => message.state === BROADCAST_MESSAGE_STATES.PUBLISHED) : [];
  }, [broadcastMessages])

  const draftMessages = useMemo(() => {
    return broadcastMessages ? broadcastMessages.filter(message => message.state === BROADCAST_MESSAGE_STATES.DRAFT) : [];
  }, [broadcastMessages])

  console.log(publishedMessages, draftMessages);

  return (
    <>
      <BroadcastDialogManager sessionId={sessionId} userId={userId} />
      <Box>
        
        <>
          <Box m={2} marginTop={1} display="flex">
            <LiveIcon color="primary" style={{ marginRight: 8 }} />
            <Typography variant="button" color="primary">
              Live Messages
            </Typography>
          </Box> 
          { 
            activeBroadcastMessage && (
              <BroadcastMessageItem key={activeBroadcastMessage.id} broadcastMessage={activeBroadcastMessage} />
            )
          }
          {
            !activeBroadcastMessage && (
              <Box paddingLeft={2} paddingRight={2}>
                <Typography>
                  No active broadcast messages
                </Typography>
              </Box> 
            )
          }
        </>
        
        <Box paddingLeft={2} paddingRight={2} marginTop={2} width="100%" display="flex" justifyContent="center" alignItems="center">
          <Button onClick={() => setCreateBroadcastDialog(true)} variant="contained" color="primary">
            Create Broadcast
          </Button>
        </Box> 
        

        {draftMessages.length > 0 && (
          <>
            <Box m={2} mt={6} display="flex">
              <SvgIcon color="primary" style={{ marginRight: 8 }}>
                <DraftIcon />
              </SvgIcon>
              <Typography variant="button" color="primary">
                Draft Messages
              </Typography>
            </Box>
            {draftMessages.map((message, index) => {
              return (
                <>
                  <BroadcastMessageItem key={message.id} broadcastMessage={message} />
                  {
                    index !== draftMessages.length - 1 && (
                      <LocalDivider />
                    )
                  }
                </>
              )
            })}
          </>
        )}

        {
          publishedMessages.length > 0 && (
            <>
              <Box m={2} mt={6} display="flex">
                <SvgIcon color="primary" style={{ marginRight: 8 }}>
                   <ArchiveIcon />
                </SvgIcon>
                <Typography variant="button" color="primary">
                  Published Messages
                </Typography>
              </Box>
              {publishedMessages.map((message, index) => {
                return (
                <>
                  <BroadcastMessageItem key={message.id} broadcastMessage={message} />
                  {
                    index !== publishedMessages.length - 1 && (
                      <LocalDivider />
                    )
                  }
                </>
              )
              })}
            </>
          )
        }

      </Box>
    </>
  );
}

export default BroadcastMessagePane;


