export const getJistiServer = (eventSessionDetails) => {
  if (eventSessionDetails && eventSessionDetails.customJitsiServer) {
    let server = eventSessionDetails.customJitsiServer;
    return server + (server.slice(-1) === "/" ? "" : "/");
  }
  return "https://meet.jit.si/";
};

export const getJistiDomain = (eventSessionDetails) => {
  if (eventSessionDetails && eventSessionDetails.customJitsiServer) {
    let domain = eventSessionDetails.customJitsiServer;
    domain = domain.replace("https://", "");
    domain = domain.replace("http://", "");
    if (domain.slice(-1) === "/") {
      domain = domain.slice(0, -1);
    }

    return domain;
  }
  return "meet.jit.si";
};

export const getJitsiOptions = (roomName, parentNode, showHangup = true) => {
  return {
    roomName,
    parentNode,
    interfaceConfigOverwrite: {
      // filmStripOnly: true,
      DEFAULT_REMOTE_DISPLAY_NAME: "Veertlier",
      enableWelcomePage: false,
      SHOW_JITSI_WATERMARK: false,
      JITSI_WATERMARK_LINK: "https://veertly.com",
      TOOLBAR_ALWAYS_VISIBLE: true,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: false,
      SHOW_POWERED_BY: false,
      GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "closedcaptions",
        "desktop",
        "fullscreen",
        "fodeviceselection",
        showHangup ? "hangup" : "",
        // "profile",
        "info",
        "recording",
        "livestreaming",
        "etherpad",
        "sharedvideo",
        "settings",
        // "raisehand",
        "videoquality",
        "filmstrip",
        "invite",
        "feedback",
        "stats",
        "shortcuts",
        "tileview",
        // "videobackgroundblur",
        "download",
        "help",
        "mute-everyone",
        "e2ee"
      ],
      CLOSE_PAGE_GUEST_HINT: false,
      SHOW_PROMOTIONAL_CLOSE_PAGE: false,
      RECENT_LIST_ENABLED: false

      // SUPPORT_URL: 'https://github.com/jitsi/jitsi-meet/issues/new',
    }
  };
};
