import React, { useContext } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
// import MenuIcon from "@material-ui/icons/SettingsOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton, Box } from "@material-ui/core";
import { BROADCAST_MESSAGE_STATES } from "../../../Modules/broadcastOperations";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";

const BroadcastMessagesMenu = ({ broadcastMessage, showPublish = true }) => {
  const { state } = broadcastMessage;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const {
    setUpdateBroadcastDialog,
    setDeleteBroadcastDialog,
    setLaunchBroadcastDialog
  } = useContext(BroadcastDialogContext);

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuClose = (e) => {
    e.stopPropagation();
    closeMenu(null);
  };

  const handleMenu = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleUpdateBroadcastClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setUpdateBroadcastDialog(broadcastMessage);
  };
  const handleLaunchBroadcastClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setLaunchBroadcastDialog(broadcastMessage);
  };
  // const handleStopPollClick = (e) => {
  //   e.stopPropagation();
  //   closeMenu();
  //   setOpenStopDialogPoll(poll);
  // };

  const handleDeleteBroadcastClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setDeleteBroadcastDialog(broadcastMessage);
  };

  return (
    <Box align="right">
      <IconButton
        color="primary"
        aria-label="Broadcast menu"
        onClick={handleMenu}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={menuAnchorEl}
        keepMounted
        open={openMenu}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleUpdateBroadcastClick}>Edit</MenuItem>

        {state === BROADCAST_MESSAGE_STATES.DRAFT && showPublish && (
          <MenuItem onClick={handleLaunchBroadcastClick}>Publish</MenuItem>
        )}
        {state === BROADCAST_MESSAGE_STATES.PUBLISHED && showPublish && (
          <MenuItem onClick={handleLaunchBroadcastClick}>Republish</MenuItem>
        )}
        {/* {state === POLLS_STATES.PUBLISHED && (
          <MenuItem onClick={handleStopPollClick}>Stop</MenuItem>
        )} */}
        <MenuItem onClick={handleDeleteBroadcastClick}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

BroadcastMessagesMenu.propTypes = {
  broadcastMessage: PropTypes.object.isRequired
};

export default BroadcastMessagesMenu;
