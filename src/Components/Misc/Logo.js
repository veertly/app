import React from "react";

function Logo(props) {
  return (
    <img
      alt="Logo"
      src="/static/logo.svg"
      {...props}
      style={{ maxHeight: 40 }}
    />
  );
}

export default Logo;
