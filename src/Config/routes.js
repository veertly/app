export default {
  HOME: () => "/",
  EVENT_PAGE: (id = ":id") => `/events/${id}`,
  TEST_JITSI: () => "/test-jitsi",
  EVENT_SESSION_OLD: (sessionId = ":sessionId") => `/session/${sessionId}`,
  EVENT_SESSION: (sessionId = ":sessionId") => `/v/${sessionId}`,
  EVENT_SESSION_LIVE: (sessionId = ":sessionId") => `/v/${sessionId}/live`,
  EDIT_EVENT_SESSION: (sessionId = ":sessionId") => `/v/${sessionId}/edit`,
  CREATE_EVENT_SESSION: () => "/new-event",
  LOGIN_PATH: () => "/login",
  GO_TO_LOGIN: (callback = "/") => `/login?callback=${callback}`,
  EDIT_PROFILE_RAW: () => "/profile/edit",
  EDIT_PROFILE: (callback = "/") => `/profile/edit?callback=${callback}`,
};
