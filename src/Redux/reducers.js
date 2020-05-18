import { combineReducers } from "redux";
import { dialogsReducer as dialogs } from "./dialogs";
import { eventSessionReducer as eventSession } from "./eventSession";
import { accountReducer as account } from "./account";

export default combineReducers({ dialogs, eventSession, account });
