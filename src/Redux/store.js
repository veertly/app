import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore, persistReducer } from 'redux-persist';
import dialogs from "./reducers/dialogs";
import chatMessagesReducer from './reducers/chatMessages';
import storage from 'redux-persist/lib/storage'

const persistConfigChat = {
  key: 'veertly-storage',
  storage,
  whitelist: ['messageCount']
};

const reducers = { 
  dialogs, 
  chat: persistReducer(persistConfigChat, chatMessagesReducer)
};

const rootReducer = combineReducers(reducers)

const middlewares = [];

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export const persistor = persistStore(store);

export default store;
