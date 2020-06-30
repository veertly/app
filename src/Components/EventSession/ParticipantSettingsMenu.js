import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/SettingsOutlined";
import { IconButton, Box, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { getSessionId } from "../../Redux/eventSession";
import {
  ROLES,
  setUserRole,
  unsetUserRole
} from "../../Modules/rolesOperations";
import EllipsisLoader from "../Misc/EllipsisLoader";

const ParticipantSettingsMenu = ({ participant }) => {
  // const { state } = poll;
  const [statusText, setStatusText] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = useSelector(getSessionId);

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const isSpeaker = useMemo(
    () =>
      participant &&
      participant.roles &&
      participant.roles.includes(ROLES.SPEAKER.key),
    [participant]
  );
  const isHost = useMemo(
    () =>
      participant &&
      participant.roles &&
      participant.roles.includes(ROLES.HOST.key),
    [participant]
  );
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

  const handleToggleRole = (role) => async (e) => {
    e.stopPropagation();
    closeMenu();
    try {
      setError(null);
      setStatusText("Setting permissions");
      if (participant.roles && participant.roles.includes(role.key)) {
        await unsetUserRole(sessionId, participant.id, role.key);
      } else {
        await setUserRole(sessionId, participant.id, role.key);
      }
      setStatusText(null);
    } catch (error) {
      console.error(error);
      setStatusText(null);
      setError(error.message);
    }
  };

  return (
    <Box align="right">
      {statusText && (
        <Typography variant="caption">
          {statusText}
          <EllipsisLoader />
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
      <IconButton
        color="primary"
        aria-label="participant menu"
        onClick={handleMenu}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={menuAnchorEl}
        keepMounted
        open={openMenu}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleToggleRole(ROLES.HOST)}>
          {isHost ? "Remove from Host" : "Set as Host"}
        </MenuItem>
        <MenuItem onClick={handleToggleRole(ROLES.SPEAKER)}>
          {isSpeaker ? "Remove from Speaker" : "Set as Speaker"}
        </MenuItem>
      </Menu>
    </Box>
  );
};

ParticipantSettingsMenu.propTypes = {
  participant: PropTypes.object.isRequired
};

export default ParticipantSettingsMenu;
