import React, { useReducer } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
// import "react-datepicker/dist/react-datepicker.css";

// import appSyncConfig from "./aws-exports";
// import { ApolloProvider } from "react-apollo";
// import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
// import AWSAppSyncClient, { defaultDataIdFromObject } from "aws-appsync";
import routes from "./Config/routes";

import "./App.css";

import MeetupsContainer from "./Containers/MeetupsContainer";
import MeetupContainer from "./Containers/MeetupContainer";
import ProfileContainer from "./Containers/ProfileContainer";
import EventSessionContainer from "./Containers/EventSession/EventSessionContainer";
import CreateSessionContainer from "./Containers/Organizer/CreateSessionContainer";

import LoginContainer from "./Containers/LoginContainer";
import HomePage from "./Containers/HomePage";

import PrivateRoute from "./Components/PrivateRoute";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { userOperationsReducer } from "./Redux/userOperationsReducer";
import { GlobalContext } from "./Redux/GlobalContext";

import useCombinedReducers from "use-combined-reducers";
import EditProfileContainer from "./Containers/EditProfileContainer";

import { SnackbarProvider } from "material-ui-snackbar-provider";
import EventPageContainer from "./Containers/EventSession/EventPageContainer";
import EditSessionContainer from "./Containers/Organizer/EditSessionContainer";

import { Provider } from "react-redux";
import store from "./Redux/store";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#1c4762" },
    secondary: { main: "#5cdb94" },
    background: {
      default: "#F4F6F8",
      paper: "#FFF",
    },
  },
  overrides: {
    // Name of the component ⚛️ / style shee
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        borderRadius: 0,
      },
    },

    MuiPaper: {
      rounded: {
        borderRadius: 0,
      },
    },
  },
});

const App = () => {
  const [state, dispatch] = useCombinedReducers({
    userOperations: useReducer(userOperationsReducer, {}),
  });

  return (
    <Provider store={store}>
      <GlobalContext.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider SnackbarProps={{ autoHideDuration: 10000 }}>
            <CssBaseline />
            <BrowserRouter>
              <Switch>
                <Route exact={true} path={routes.HOME()} component={HomePage} />
                <Route exact={true} path={routes.LIST_MEETUPS()} component={MeetupsContainer} />
                <Route exact={true} path={routes.MEETUP_PAGE()} component={MeetupContainer} />
                <PrivateRoute exact={true} path={routes.EVENT_SESSION_LIVE()} component={EventSessionContainer} />
                <PrivateRoute exact={true} path={routes.EDIT_EVENT_SESSION()} component={EditSessionContainer} />
                <Route exact={true} path={routes.EVENT_SESSION()} component={EventPageContainer} />
                <Route exact={true} path={routes.LOGIN_PATH()} component={LoginContainer} />
                <PrivateRoute path={routes.EDIT_PROFILE_RAW()} component={EditProfileContainer} />
                <PrivateRoute path={routes.PROFILE()} component={ProfileContainer} />
                <PrivateRoute path={routes.CREATE_EVENT_SESSION()} component={CreateSessionContainer} />

                {/* <Route exact={true} path="/events" component={AllEventsContainer} /> */}
                {/* <Route path="/event/:id" component={ViewEvent} />
      <Route path="/newEvent" component={NewEvent} /> */}
                <Route component={HomePage} />
              </Switch>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </GlobalContext.Provider>
    </Provider>
  );
};

// const client = new AWSAppSyncClient({
//   url: appSyncConfig.aws_appsync_graphqlEndpoint,
//   region: appSyncConfig.aws_appsync_region,
//   auth: {
//     type: appSyncConfig.aws_appsync_authenticationType,
//     apiKey: appSyncConfig.aws_appsync_apiKey
//   },
//   cacheOptions: {
//     dataIdFromObject: obj => {
//       let id = defaultDataIdFromObject(obj);

//       if (!id) {
//         const { __typename: typename } = obj;
//         switch (typename) {
//           case "Comment":
//             return `${typename}:${obj.commentId}`;
//           default:
//             return id;
//         }
//       }

//       return id;
//     }
//   }
// });

const WithProvider = () => (
  // <ApolloProvider client={client}>
  //   <ApolloHooksProvider client={client}>
  <App />
  //   </ApolloHooksProvider>
  // </ApolloProvider>
);

export default WithProvider;
