export const DEFAULT_JITSI_SERVER = "https://meet.jit.si/";
export const JITSI_MEET_SDK_URL = "https://meet.jit.si/external_api.js";

export const getJistiServer = (eventSessionDetails) => {
  if (
    eventSessionDetails &&
    eventSessionDetails.customJitsiServer &&
    eventSessionDetails.customJitsiServer.trim() !== ""
  ) {
    let server = eventSessionDetails.customJitsiServer;
    if (!server.includes("http")) {
      server = "https://" + server;
    }
    return server + (server.slice(-1) === "/" ? "" : "/");
  }
  return DEFAULT_JITSI_SERVER;
};

export const getJistiDomain = (eventSessionDetails) => {
  if (
    eventSessionDetails &&
    eventSessionDetails.customJitsiServer &&
    eventSessionDetails.customJitsiServer.trim() !== ""
  ) {
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

export const isMeetJitsi = (domain) => domain && domain.includes("meet.jit.si");

export const getJitsiOptions = (
  roomName,
  parentNode,
  showHangup = true,
  showChat = true,
  showJitsiLogo = false
) => {
  return {
    roomName,
    parentNode,
    interfaceConfigOverwrite: {
      // filmStripOnly: true,
      DEFAULT_REMOTE_DISPLAY_NAME: "Veertlier",
      enableWelcomePage: false,
      SHOW_JITSI_WATERMARK: showJitsiLogo,
      // JITSI_WATERMARK_LINK: "https://veertly.com",

      TOOLBAR_ALWAYS_VISIBLE: true,
      SHOW_WATERMARK_FOR_GUESTS: showJitsiLogo,
      SHOW_BRAND_WATERMARK: showJitsiLogo,
      SHOW_POWERED_BY: false,
      GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
      SHOW_CHROME_EXTENSION_BANNER: false,
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "closedcaptions",
        "desktop",
        "fullscreen",
        "fodeviceselection",
        showHangup ? "hangup" : "",
        showChat ? "chat" : "",

        // "profile",
        // "info",
        "recording",
        "livestreaming",
        "etherpad",
        "sharedvideo",
        "settings",
        "raisehand",
        "videoquality",
        "filmstrip",
        // "invite",
        // "feedback",
        "stats",
        "shortcuts",
        "tileview",
        // "videobackgroundblur",
        // "download",
        "help",
        "mute-everyone",
        "e2ee"
      ],
      CLOSE_PAGE_GUEST_HINT: false,
      SHOW_PROMOTIONAL_CLOSE_PAGE: false,
      RECENT_LIST_ENABLED: false,
      SETTINGS_SECTIONS: [
        "devices",
        "language",
        "moderator"
        // "profile",
        // "calendar"
      ]

      // SUPPORT_URL: 'https://github.com/jitsi/jitsi-meet/issues/new',
    }
  };
};
