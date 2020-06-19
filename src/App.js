import "./Helpers/wdyr";

import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

// import { BrowserRouter, Route, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
// import routes from "./Config/routes";
// import { PersistGate } from "redux-persist/integration/react";

import "./App.css";
import ClosableSnackbar from "./Components/Misc/CloseableSnackbar";
// import EventSessionContainer from "./Containers/EventSession/EventSessionContainer";
// import PasswordProtectedEventSessionContainer from "./Containers/EventSession/PasswordProtectedEventSessionContainer";
// import CreateSessionContainer from "./Containers/Organizer/CreateSessionContainer";

// import LoginContainer from "./Containers/LoginContainer";
// import HomePage from "./Containers/HomePage";

// import PrivateRoute from "./Components/PrivateRoute";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// import EditProfileContainer from "./Containers/EditProfileContainer";

import { SnackbarProvider } from "material-ui-snackbar-provider";
// import EventPageContainer from "./Containers/EventSession/EventPageContainer";
// import EditSessionContainer from "./Containers/Organizer/EditSessionContainer";

import { Provider } from "react-redux";
import store from "./Redux/store";
import Routes from "./Routes";
import Auth from "./Components/Guards/Auth";
import AppMetaTags from "./Components/Shared/AppMetaTags";
import { RecoilRoot } from "recoil";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#1c4762" },
    secondary: { main: "#5cdb94" },
    background: {
      default: "#F4F6F8",
      paper: "#FFF"
    },
    filtersSelected: "#c1d4e3"
  },
  overrides: {
    // Name of the component ⚛️ / style shee
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        borderRadius: 0
      }
    },

    MuiPaper: {
      rounded: {
        borderRadius: 0
      }
    },
    MuiTooltip: {
      popper: {
        pointerEvents: "none",
        "&$open": {
          pointerEvents: "none"
        }
      }
    }
  }
});
const history = createBrowserHistory();

const App = () => {
  return (
    <Provider store={store}>
      <RecoilRoot>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            SnackbarProps={{ autoHideDuration: 10000 }}
            SnackbarComponent={ClosableSnackbar}
          >
            <AppMetaTags />

            <CssBaseline />
            <Router history={history}>
              <Auth>
                {/* <ScrollReset /> */}
                {/* <GoogleAnalytics /> */}
                {/* <CookiesNotification /> */}
                {/* <SettingsNotification /> */}
                <Routes />
              </Auth>
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
        {/* </PersistGate> */}
      </RecoilRoot>
    </Provider>
  );
};

const WithProvider = () => <App />;

export default WithProvider;
