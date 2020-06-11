import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/SettingsOutlined";
import { IconButton, Box } from "@material-ui/core";
// import ConfirmationDialog from "../../Misc/ConfirmationDialog";
// import { setPollState, POLLS_STATES } from "../../../Modules/pollsOperations";
// import { useSelector } from "react-redux";
// import { getSessionId, getUserId } from "../../../Redux/eventSession";
import PollsContext from "../../../Contexts/PollsContext";
import { POLLS_STATES } from "../../../Modules/pollsOperations";
// import { Settings as MenuIcon } from "react-feather";
// const useStyles = makeStyles((theme) => ({
//   menuContainer: {
//     position: "absolute",
//     right: 0,
//     top: theme.spacing(-2)
//   }
// }));

const PollsMenu = ({ poll }) => {
  const { state } = poll;

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const {
    setOpenLaunchDialogPoll,
    setOpenStopDialogPoll,
    setOpenDeleteDialogPoll
  } = React.useContext(PollsContext);

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
          <MenuItem disabled>Edit</MenuItem>
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
