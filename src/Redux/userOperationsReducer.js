import { registerNewUser } from "../Modules/userOperations";

export const userOperations = {
  REGISTER_NEW_USER: "users.REGISTER_NEW_USER"
};

export const userOperationsReducer = (state, action) => {
  switch (action.type) {
    case userOperations.REGISTER_NEW_USER:
      registerNewUser(action.user);
      return state;
    default:
      return state;
  }
};
