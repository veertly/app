import React, { useContext, useMemo } from "react";
import { Box, Button, SvgIcon, Typography } from "@material-ui/core";
import { getUserId, getSessionId } from "../../../Redux/eventSession";
import { useSelector } from "react-redux";
import BroadcastDialogManager from "./BroadcastDialogManager";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";
import BroadcastMessagesContext from "../../../Contexts/BroadcastMessagesContext";
import { BROADCAST_MESSAGE_STATES } from "../../../Modules/broadcastOperations";
import DraftIcon from "../../../Assets/Icons/Draft";
import BroadcastMessagesMenu from "./BroadcastMessagesMenu";

const BroadcastMessageItem = ({ broadcastMessage }) => {
  return (
    <Box width="100%" display="flex" flexDirection="row" alignItems="center">
      {broadcastMessage.message}
      <Box alignSelf="flex-end">
        <BroadcastMessagesMenu broadcastMessage={broadcastMessage} />
      </Box>
    </Box>
  )
}

const BroadcastMessagePane = () => {
  // const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  // const isUserEventOwner = useSelector(isEventOwner);
  const userId = useSelector(getUserId);
  const sessionId = useSelector(getSessionId);

  const {
    setCreateBroadcastDialog
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
        <Button onClick={() => setCreateBroadcastDialog(true)}>
          Create Broadcast Message
        </Button>

        {draftMessages.length > 0 && (
          <>
            <Box m={2} mt={6} display="flex">
              <SvgIcon color="primary" style={{ marginRight: 8 }}>
                <DraftIcon />
              </SvgIcon>
              <Typography variant="button" color="primary">
                Draft Polls
              </Typography>
            </Box>
            {draftMessages.map((message) => {
              return (
                <BroadcastMessageItem key={message.id} broadcastMessage={message} />
              )
            })}
          </>
        )}

        {
          publishedMessages.length > 0 && (
            <>
              <Box m={2} mt={6} display="flex">
                <SvgIcon color="primary" style={{ marginRight: 8 }}>
                  <DraftIcon />
                </SvgIcon>
                <Typography variant="button" color="primary">
                  Published Messages
                </Typography>
              </Box>
              {publishedMessages.map((message) => {
                return (
                  <BroadcastMessageItem key={message.id}  broadcastMessage={message} />
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


