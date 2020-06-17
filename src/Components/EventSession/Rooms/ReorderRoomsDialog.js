import React, { useState, useMemo, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

import { useSelector, useDispatch } from "react-redux";
import { DialogActions, DialogTitle, DialogContent } from "@material-ui/core";
import { closeRoomReorder, isRoomReorderOpen } from "../../../Redux/dialogs";
import DialogClose from "../../Misc/DialogClose";
import ReorderList from "../../Misc/ReorderList";
import {
  isEventOwner as isEventOwnerSelector,
  getSessionId
} from "../../../Redux/eventSession";
import RoomCard from "./RoomCard";
import { reorderRooms } from "../../../Modules/eventSessionOperations";
import { usePrevious } from "react-use";

const useStyles = makeStyles((theme) => ({
  button: { margin: theme.spacing(2) },
  dialogTitle: { color: theme.palette.primary.main }
}));

const renderRoom = (room) => <RoomCard room={room} previewOnly />;

const ReorderRoomsDialog = ({ rooms }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector(isRoomReorderOpen);

  const isEventOwner = useSelector(isEventOwnerSelector);
  const sessionId = useSelector(getSessionId);

  const [orderedRooms, setOrderedRooms] = useState(rooms);
  const prevOrderedRooms = usePrevious(orderedRooms);

  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      JSON.stringify(rooms) !== JSON.stringify(orderedRooms) &&
      JSON.stringify(prevOrderedRooms) === JSON.stringify(orderedRooms)
    ) {
      setOrderedRooms(rooms);
    }
  }, [orderedRooms, prevOrderedRooms, rooms]);

  const hasChanged = useMemo(
    () => JSON.stringify(orderedRooms) !== JSON.stringify(rooms),
    [orderedRooms, rooms]
  );

  if (!isEventOwner) {
    console.error(
      "Only organizer of the event is allowed to reorder the rooms"
    );
    return null;
  }

  const handleClose = () => {
    setOrderedRooms(rooms);
    dispatch(closeRoomReorder());
  };

  const handleReorderClick = async () => {
    // console.log("Reorder clicked");
    setReordering(true);
    try {
      await reorderRooms(sessionId, orderedRooms);
      handleClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setReordering(false);
  };

  return (
    <div>
      <DialogClose open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle className={classes.dialogTitle}>Reorder Rooms</DialogTitle>
        <DialogContent>
          <ReorderList
            items={orderedRooms}
            setItems={setOrderedRooms}
            renderItem={renderRoom}
          />

          {error && (
            <Alert severity={"error"} className={classes.alert}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            className={classes.button}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReorderClick}
            className={classes.button}
            color="primary"
            variant="contained"
            disabled={!hasChanged || reordering}
          >
            Reorder
          </Button>
        </DialogActions>
      </DialogClose>
    </div>
  );
};

export default ReorderRoomsDialog;
