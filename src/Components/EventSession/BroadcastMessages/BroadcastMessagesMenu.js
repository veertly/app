import React, { useContext } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/SettingsOutlined";
import { IconButton, Box } from "@material-ui/core";
import { POLLS_STATES } from "../../../Modules/pollsOperations";
import BroadcastDialogContext from "../../../Contexts/BroadcastDialogContext";

const BroadcastMessagesMenu = ({ broadcastMessage }) => {
  const { state } = broadcastMessage;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const {
    setUpdateBroadcastDialog,
    setDeleteBroadcastDialog,
    setLaunchBroadcastDialog,
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

  const handleUpdatePollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setUpdateBroadcastDialog(broadcastMessage);
  };
  const handleLaunchPollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setLaunchBroadcastDialog(broadcastMessage);
  };
  // const handleStopPollClick = (e) => {
  //   e.stopPropagation();
  //   closeMenu();
  //   setOpenStopDialogPoll(poll);
  // };

  const handleDeletePollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setDeleteBroadcastDialog(broadcastMessage);
  };

  return (
    <Box align="right">
      <IconButton color="primary" aria-label="Call menu" onClick={handleMenu}>
        <MenuIcon />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={menuAnchorEl}
        keepMounted
        open={openMenu}
        onClose={handleMenuClose}
      >
        
        <MenuItem onClick={handleUpdatePollClick}>Edit</MenuItem>
        
        {state === POLLS_STATES.DRAFT && (
          <MenuItem onClick={handleLaunchPollClick}>Launch</MenuItem>
        )}
        {state === POLLS_STATES.PUBLISHED && (
          <MenuItem onClick={handleLaunchPollClick}>Re-launch</MenuItem>
        )}
        {/* {state === POLLS_STATES.PUBLISHED && (
          <MenuItem onClick={handleStopPollClick}>Stop</MenuItem>
        )} */}
        <MenuItem onClick={handleDeletePollClick}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

BroadcastMessagesMenu.propTypes = {
  broadcastMessage: PropTypes.object.isRequired
};

export default BroadcastMessagesMenu;
