import { combineReducers } from "redux";
import { dialogsReducer as dialogs } from "./dialogs";
import { eventSessionReducer as eventSession } from "./eventSession";

export default combineReducers({ dialogs, eventSession });
