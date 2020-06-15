import React from "react";
import { makeStyles /* , useTheme */ } from "@material-ui/core/styles";
import {
  // TextField,
  IconButton,
  InputAdornment,
  Input,
  Box,
  // Popover
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import Picker from "emoji-picker-react";
import "emoji-mart/css/emoji-mart.css";
// import { Picker } from "emoji-mart";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "white",
    height: "100%",
    display: "flex",
    alignItems: "center",
    // position: "relative",
  },
  message: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 8,
  },
  emojiContainer: {
    position: "absolute",
    right: 0,
  }
}));

export default (props) => {
  const { onMessageSendClicked } = props;
  const classes = useStyles();
  const [message, setMessage] = React.useState("");
  const [emojisShown, setEmojisShow] = React.useState(false);
  // const [anchorEl, setAnchorEl] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSendClicked(message);
    setMessage("");
  };

  const handleEmoticonClicked = (event) => {
    setEmojisShow(!emojisShown);
    // setAnchorEl(event.target);
  }

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  return (
    <>
    <form onSubmit={handleSubmit} className={classes.root}>
      <div className={classes.message}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleEmoticonClicked}
                  // onMouseDown={handleMouseDownPassword}
                >
                  <InsertEmoticonIcon />
                </IconButton>
              </InputAdornment>
            }
        ></Input>
      </div>
      
      <div className={classes.buttons}>
        <IconButton type="submit" aria-label="delete" className={classes.margin} color="primary">
          <SendIcon />
        </IconButton>
      </div>

      <Box position="absolute" bottom={30} display={emojisShown ? "block" : "none"}>
        {/* <Popover
          id={id}
          open={true}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >  */}
            <Picker  />
        {/* </Popover> */}
      </Box>
      
    </form>

    </>
  );
};
