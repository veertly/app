import React from "react";
import PropTypes from "prop-types";
import { ROLES } from "../../Modules/rolesOperations";
import Label from "./Label";

const ParticipantRole = ({ roles }) => {
  if (roles && roles.length > 0) {
    let roleKey = roles[0];
    if (roles.includes(ROLES.SPEAKER.key)) {
      roleKey = ROLES.SPEAKER.key;
    } else if (roles.includes(ROLES.HOST.key)) {
      roleKey = ROLES.HOST.key;
    }
    return <Label color="primary">{ROLES[roleKey].label}</Label>;
  }
  return null;
};

ParticipantRole.propTypes = {
  roles: PropTypes.array
};

export default ParticipantRole;
