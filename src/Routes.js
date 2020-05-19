/* eslint-disable react/no-array-index-key */
import React, { lazy, Suspense, Fragment } from "react";
import { Switch, /*Redirect, */ Route } from "react-router-dom";
// import DashboardLayout from "src/layouts/DashboardLayout";
// // import DocsLayout from 'src/layouts/DocsLayout';
// import MainLayout from "src/layouts/MainLayout";
// import HomeView from "src/views/pages/HomeView";
import SplashScreen from "./Components/Misc/SplashScreen";
import AuthGuard from "./Components/Guards/AuthGuard";
import AuthEmailGuard from "./Components/Guards/AuthEmailGuard";
import GuestGuard from "./Components/Guards/GuestGuard";
import routes from "./Config/routes";

// import PasswordProtectedEventSessionContainer from "./Containers/EventSession/PasswordProtectedEventSessionContainer";

const LoginView = lazy(() => import("./Containers/Auth/LoginView"));
const routesConfig = [
  {
    exact: true,
    path: routes.HOME(),
    component: lazy(() => import("./Containers/HomePage"))
  },
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("./Containers/Error404View"))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: routes.LOGIN(),
    component: () => <LoginView loginWithEmail={false} />
  },
  {
    exact: true,
    guard: GuestGuard,
    path: routes.LOGIN_EMAIL(),
    component: () => <LoginView loginWithEmail={true} />
  },
  {
    exact: true,
    guard: GuestGuard,
    path: routes.LOGIN_REGISTER(),
    component: lazy(() => import("./Containers/Auth/RegisterView"))
  },
  {
    exact: true,
    path: routes.EVENT_SESSION(),
    component: lazy(() =>
      import("./Containers/EventSession/EventPageContainer")
    )
  },
  {
    path: "/v",
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: routes.EVENT_SESSION_LIVE(),
        component: lazy(() =>
          import(
            "./Containers/EventSession/PasswordProtectedEventSessionContainer"
          )
        )
      },
      {
        exact: true,
        path: routes.EVENT_SESSION_LIVE_CODE(),
        component: lazy(() =>
          import(
            "./Containers/EventSession/PasswordProtectedEventSessionContainer"
          )
        )
      },
      {
        exact: true,
        path: routes.EDIT_EVENT_SESSION(),
        component: lazy(() =>
          import("./Containers/Organizer/EditSessionContainer")
        )
      },
      {
        component: lazy(() => import("./Containers/Error404View"))
      }
    ]
  },
  {
    exact: true,
    path: routes.EDIT_PROFILE(),
    guard: AuthGuard,
    component: lazy(() => import("./Containers/EditProfileContainer"))
  },

  {
    exact: true,
    path: routes.CREATE_EVENT_SESSION(),
    guard: AuthEmailGuard,
    component: lazy(() =>
      import("./Containers/Organizer/CreateSessionContainer")
    )
  },
  {
    path: "*",
    routes: [
      // {
      //   exact: true,
      //   path: '/pricing',
      //   component: lazy(() => import('src/views/pages/PricingView'))
      // },
      {
        component: lazy(() => import("./Containers/Error404View"))
      }
    ]
  }
];

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<SplashScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
