import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/SettingsOutlined";
import { IconButton, Box } from "@material-ui/core";
import ConfirmationDialog from "../../Misc/ConfirmationDialog";
import { setPollState, POLLS_STATES } from "../../../Modules/pollsOperations";
import { useSelector } from "react-redux";
import { getSessionId, getUserId } from "../../../Redux/eventSession";
// import { Settings as MenuIcon } from "react-feather";
// const useStyles = makeStyles((theme) => ({
//   menuContainer: {
//     position: "absolute",
//     right: 0,
//     top: theme.spacing(-2)
//   }
// }));

const PollsMenu = ({ poll }) => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const openMenu = Boolean(menuAnchorEl);
  const [openLaunch, setOpenLaunch] = useState(false);
  const [openStop, setOpenStop] = useState(false);

  const sessionId = useSelector(getSessionId);
  const userId = useSelector(getUserId);

  // const classes = useStyles();

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
    setOpenLaunch(true);
  };
  const handleStopPollClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setOpenStop(true);
  };

  const setLaunchPoll = async () => {
    await setPollState(sessionId, userId, poll.id, POLLS_STATES.PUBLISHED);
  };

  const setStoppedPoll = async () => {
    await setPollState(sessionId, userId, poll.id, POLLS_STATES.TERMINATED);
  };
  return (
    <Box align="right">
      {openLaunch && (
        <ConfirmationDialog
          open={openLaunch}
          closeDialog={() => setOpenLaunch(false)}
          title="Confirm launching of poll"
          alertMessage="This poll will now be live and attendes can start voting"
          onConfirm={setLaunchPoll}
          confirmationButtonLabel="Launch Poll"
        />
      )}
      {openStop && (
        <ConfirmationDialog
          open={openStop}
          closeDialog={() => setOpenStop(false)}
          title="Confirm stopping of poll"
          alertMessage="This poll will now be stopped and attendes can no longer vote"
          severity="warning"
          onConfirm={setStoppedPoll}
          confirmationButtonLabel="Stop Poll"
        />
      )}
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
        <MenuItem /* onClick={handleRenameClick} */>Edit</MenuItem>
        <MenuItem onClick={handleLaunchPollClick}>Launch</MenuItem>
        <MenuItem onClick={handleStopPollClick}>Stop</MenuItem>
      </Menu>
    </Box>
  );
};

PollsMenu.propTypes = {
  poll: PropTypes.object.isRequired
};

export default PollsMenu;
