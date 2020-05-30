import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunkMiddleware from "redux-thunk";

// import { persistStore, persistReducer } from "redux-persist";
import { dialogsReducer as dialogs } from "./dialogs";
import { accountReducer as account } from "./account";
import { eventSessionReducer as eventSession } from "./eventSession";
// import storage from "redux-persist/lib/storage";

// const persistConfigChat = {
//   key: "veertly-storage",
//   storage,
//   whitelist: ["messageCount"]
// };

const reducers = {
  dialogs,
  eventSession,
  account
};

const rootReducer = combineReducers(reducers);

const middlewares = [thunkMiddleware];

const store = createStore(
  rootReducer,
  // applyMiddleware(...middlewares)
  composeWithDevTools(applyMiddleware(...middlewares))
);

// export const persistor = persistStore(store);

export default store;
