import { setUserRoleFunc, unsetUserRoleFunc } from "./firebaseApp";

export const ROLES = {
  ATTENDEE: { key: "ATTENDEE", label: "Attendee" },
  SPEAKER: { key: "SPEAKER", label: "Speaker" },
  HOST: { key: "HOST", label: "Host" },
  OWNER: { key: "OWNER", label: "Admin" }
};

export const setUserRole = async (eventSessionId, userId, role) => {
  await setUserRoleFunc({ eventSessionId, userId, role });
};

export const unsetUserRole = async (eventSessionId, userId, role) => {
  await unsetUserRoleFunc({ eventSessionId, userId, role });
};
