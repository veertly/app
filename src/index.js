import React from "react";
import ReactDOM from "react-dom";
// import { hydrate, render } from "react-dom";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./index.css";
import App from "./App";
import { unregister } from "./registerServiceWorker";

// const rootElement = document.getElementById("root");
// if (rootElement.hasChildNodes()) {
//   hydrate(<App />, rootElement);
// } else {
//   render(<App />, rootElement);
// }

ReactDOM.render(<App />, document.getElementById("root"));

// if service worker is present we unregister it.
// registerServiceWorker();
unregister();
