import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/SettingsOutlined";
import { IconButton, Box } from "@material-ui/core";
import { POLLS_STATES } from "../../../Modules/pollsOperations";
import PollsDialogsContext from "../../../Contexts/PollsDialogsContext";

const PollsMenu = ({ poll }) => {
  const { state } = poll;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const {
    setOpenUpdateDialogPoll,
    setOpenLaunchDialogPoll,
    setOpenStopDialogPoll,
    setOpenDeleteDialogPoll
  } = React.useContext(PollsDialogsContext);

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
    setOpenUpdateDialogPoll(poll);
  };
  const handleLaunchPollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setOpenLaunchDialogPoll(poll);
  };
  const handleStopPollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setOpenStopDialogPoll(poll);
  };

  const handleDeletePollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setOpenDeleteDialogPoll(poll);
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
        {state !== POLLS_STATES.TERMINATED && (
          <MenuItem onClick={handleUpdatePollClick}>Edit</MenuItem>
        )}
        {state === POLLS_STATES.DRAFT && (
          <MenuItem onClick={handleLaunchPollClick}>Launch</MenuItem>
        )}
        {state === POLLS_STATES.TERMINATED && (
          <MenuItem onClick={handleLaunchPollClick}>Re-launch</MenuItem>
        )}
        {state === POLLS_STATES.PUBLISHED && (
          <MenuItem onClick={handleStopPollClick}>Stop</MenuItem>
        )}
        <MenuItem onClick={handleDeletePollClick}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

PollsMenu.propTypes = {
  poll: PropTypes.object.isRequired
};

export default PollsMenu;
