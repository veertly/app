import React, { useState } from "react";
import useInterval from "../../Hooks/useInterval";

const EllipsisLoader = (props) => {
  const [inlineLoaderState, setInlineLoaderState] = useState(0);
  useInterval(async () => {
    if (inlineLoaderState === 0) {
      setInlineLoaderState(1);
    } else if (inlineLoaderState === 1) {
      setInlineLoaderState(2);
    } else if (inlineLoaderState === 2) {
      setInlineLoaderState(0);
    }
  }, 300);
  return (
    <>
      <span style={{ opacity: inlineLoaderState === 0 ? "0.4" : "1" }}>.</span>
      <span style={{ opacity: inlineLoaderState === 1 ? "0.4" : "1" }}>.</span>
      <span style={{ opacity: inlineLoaderState === 2 ? "0.4" : "1" }}>.</span>
    </>
  );
};

export default EllipsisLoader;
