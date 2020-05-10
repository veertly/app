import { useRef, useEffect, useCallback } from "react";

export default () => {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return useCallback(() => ref.current, [ref]);
};
