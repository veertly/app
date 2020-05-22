import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

import { isMobileFromRdd, isChromeFromRRd } from "../Utils/device";

const MOBILE_MSG = "Your mobile device is not fully supported yet. Some features may not be available. Please use Chrome on your PC or MAC.";
const CHROME_APP = "Your browser is not fully supported yet. Some features may not be available. Please use Chrome on your PC or MAC.";


const useDeviceDetect = () => {
  const [message, setMessage]= useState("");
  const [savedShowDialog, setSavedShowDialog] = useLocalStorage("show-comp-notif", true);
  const [showDialog, setShowDialog] = useState(savedShowDialog);


  useEffect(() => {
    if (isMobileFromRdd()) {
      // setOpen(true);
      setMessage(MOBILE_MSG);
    } else if (!isChromeFromRRd()) {
      // setOpen(true);
      setMessage(CHROME_APP);
    } 
  }, []);


  const hideDialog = (permanent=false) => {
    if(permanent) {
      setSavedShowDialog(false);
    }
    setShowDialog(false);
  }

  return {
    message,
    showDialog,
    hideDialog,
  }

}

export default useDeviceDetect;
