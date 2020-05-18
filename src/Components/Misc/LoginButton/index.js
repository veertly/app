import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { GoogleIcon, GuestIcon, MailIcon } from "./icons";
import { darkStyle, lightStyle, disabledStyle, hoverStyle } from "./styles";

export default class LoginButton extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(["light", "dark"]),
    style: PropTypes.object
  };

  static defaultProps = {
    label: "Sign in as Guest",
    disabled: false,
    type: "dark",
    tabIndex: 0,
    onClick: () => {}
  };

  state = {
    hovered: false
  };

  getStyle = (propStyles) => {
    const baseStyle = this.props.type === "dark" ? darkStyle : lightStyle;
    if (this.state.hovered) {
      return { ...baseStyle, ...hoverStyle, ...propStyles };
    }
    if (this.props.disabled) {
      return { ...baseStyle, ...disabledStyle, ...propStyles };
    }
    return { ...baseStyle, ...propStyles };
  };

  mouseOver = () => {
    if (!this.props.disabled) {
      this.setState({ hovered: true });
    }
  };

  mouseOut = () => {
    if (!this.props.disabled) {
      this.setState({ hovered: false });
    }
  };

  click = (e) => {
    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  };

  render() {
    const { label, style, variant, ...otherProps } = this.props;

    return (
      <div
        {...otherProps}
        role="button"
        onClick={this.click}
        style={this.getStyle(style)}
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
      >
        {variant === "google" && <GoogleIcon {...this.props} />}
        {variant === "guest" && <GuestIcon {...this.props} />}
        {variant === "mail" && <MailIcon {...this.props} />}
        <span>{label}</span>
      </div>
    );
  }
}
