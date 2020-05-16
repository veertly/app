/* eslint-disable react/no-array-index-key */
import React, { lazy, Suspense, Fragment } from "react";
import { Switch, /*Redirect, */ Route } from "react-router-dom";
// import DashboardLayout from "src/layouts/DashboardLayout";
// // import DocsLayout from 'src/layouts/DocsLayout';
// import MainLayout from "src/layouts/MainLayout";
// import HomeView from "src/views/pages/HomeView";
import LoadingScreen from "./Components/Misc/LoadingScreen";
import AuthGuard from "./Components/Guards/AuthGuard";
// import GuestGuard from "./Components/Guards/GuestGuard";
import routes from "./Config/routes";

// import PasswordProtectedEventSessionContainer from "./Containers/EventSession/PasswordProtectedEventSessionContainer";

// const EventsListView = lazy(() => import("src/views/events/EventsListView"));
const routesConfig = [
  {
    exact: true,
    path: routes.HOME(),
    component: lazy(() => import("./Containers/HomePage"))
  },
  // {
  //   exact: true,
  //   path: "/404",
  //   component: lazy(() => import("./Containers/Error404View"))
  // },
  // {
  //   exact: true,
  //   guard: GuestGuard,
  //   path: "/login",
  //   component: lazy(() => import("./views/auth/LoginView"))
  // }

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
      }
      // {
      //   exact: true,
      //   path: routes.EVENT_SESSION_LIVE_CODE(),
      //   component: lazy(() =>
      //     import(
      //       "src/Containers/EventSession/PasswordProtectedEventSessionContainer"
      //     )
      //   )
      // },
      // {
      //   exact: true,
      //   path: routes.EDIT_EVENT_SESSION(),
      //   component: lazy(() =>
      //     import("src/Containers/EventSession/EditSessionContainer")
      //   )
      // },
      // {
      //   component: () => <Redirect to="/404" />
      // }
    ]
  }
  // {
  //   path: "/event",
  //   guard: AuthGuard,
  //   layout: DashboardLayout,
  //   routes: [
  //     {
  //       exact: true,
  //       path: "/event",
  //       component: () => <Redirect to="/events/upcoming" />
  //     },
  //     {
  //       exact: true,
  //       path: "/event/:sessionId",
  //       component: lazy(() => import("src/views/events/EventDetailsView"))
  //     },

  //     {
  //       component: () => <Redirect to="/404" />
  //     }
  //   ]
  // },

  // {
  //   path: "*",
  //   layout: MainLayout,
  //   routes: [
  //     {
  //       exact: true,
  //       path: "/home",
  //       component: HomeView
  //     },
  //     // {
  //     //   exact: true,
  //     //   path: '/pricing',
  //     //   component: lazy(() => import('src/views/pages/PricingView'))
  //     // },
  //     {
  //       component: () => <Redirect to="/404" />
  //     }
  //   ]
  // }
];

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
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
