import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { persistStore, persistReducer } from "redux-persist";
import { dialogsReducer as dialogs } from "./dialogs";
import { eventSessionReducer as eventSession } from "./eventSession";
import chatMessagesReducer from "./chatMessages";
import storage from "redux-persist/lib/storage";

const persistConfigChat = {
  key: "veertly-storage",
  storage,
  whitelist: ["messageCount"],
};

const reducers = {
  dialogs,
  eventSession,
  chat: persistReducer(persistConfigChat, chatMessagesReducer),
};

const rootReducer = combineReducers(reducers);

const middlewares = [];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export const persistor = persistStore(store);

export default store;
