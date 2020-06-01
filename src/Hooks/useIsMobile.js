// import { useState } from "react";
import { useTheme, useMediaQuery } from "@material-ui/core";
// import { isMobileFromRdd } from "../Utils/device";

export default function useIsMobile(callback, delay) {
  // const [isMobile] = useState(isMobileFromRdd());

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return isMobile;
}
