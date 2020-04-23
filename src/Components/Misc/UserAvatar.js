import React from "react";
import Avatar from "@material-ui/core/Avatar";

export default (props) => {
  const { user, onClick, size } = props;

  const getAvatarLetters = () => {
    let { firstName, lastName } = user;
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };
  const handleOnClick = (e) => {
    if (onClick) onClick(e);
  };

  let style = {};
  if (size === "small") {
    style = { width: 32, height: 32 };
  }
  if (onClick) {
    style.cursor = "pointer";
  }
  return (
    <React.Fragment>
      {user && (
        <>
          {user && user.avatarUrl && (
            <Avatar alt={user.firstName} src={user.avatarUrl} onClick={handleOnClick} style={style} />
          )}
          {user && !user.avatarUrl && (
            <Avatar onClick={handleOnClick} alt={user.firstName} style={style}>
              {user.firstName.trim() !== "" && <span>{getAvatarLetters()}</span>}
              {user.firstName.trim() === "" && <span>G</span>}
            </Avatar>
          )}
        </>
      )}
    </React.Fragment>
  );
};
