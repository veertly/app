import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import routes from "./Config/routes";
import { PersistGate } from "redux-persist/integration/react";

import "./App.css";

import EventSessionContainer from "./Containers/EventSession/EventSessionContainer";
import CreateSessionContainer from "./Containers/Organizer/CreateSessionContainer";

import LoginContainer from "./Containers/LoginContainer";
import HomePage from "./Containers/HomePage";

import PrivateRoute from "./Components/PrivateRoute";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import EditProfileContainer from "./Containers/EditProfileContainer";

import { SnackbarProvider } from "material-ui-snackbar-provider";
import EventPageContainer from "./Containers/EventSession/EventPageContainer";
import EditSessionContainer from "./Containers/Organizer/EditSessionContainer";

import { Provider } from "react-redux";
import store, { persistor } from "./Redux/store";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#1c4762" },
    secondary: { main: "#5cdb94" },
    background: {
      default: "#F4F6F8",
      paper: "#FFF",
    },
    filtersSelected: '#c1d4e3',
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
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider SnackbarProps={{ autoHideDuration: 10000 }}>
            <CssBaseline />
            <BrowserRouter>
              <Switch>
                <Route exact={true} path={routes.HOME()} component={HomePage} />
                <PrivateRoute exact={true} path={routes.EVENT_SESSION_LIVE()} component={EventSessionContainer} />
                <PrivateRoute exact={true} path={routes.EDIT_EVENT_SESSION()} component={EditSessionContainer} />
                <Route exact={true} path={routes.EVENT_SESSION()} component={EventPageContainer} />
                <Route exact={true} path={routes.LOGIN_PATH()} component={LoginContainer} />
                <PrivateRoute path={routes.EDIT_PROFILE_RAW()} component={EditProfileContainer} />
                <PrivateRoute path={routes.CREATE_EVENT_SESSION()} component={CreateSessionContainer} />
                <Route component={HomePage} />
              </Switch>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

const WithProvider = () => <App />;

export default WithProvider;
