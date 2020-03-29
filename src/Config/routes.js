export default {
  HOME: () => `/`,
  LIST_MEETUPS: () => `/meetups`,
  MEETUP_PAGE: (id = ":id") => `/meetup/${id}`,
  EVENT_PAGE: (id = ":id") => `/events/${id}`,
  TEST_JITSI: () => "/test-jitsi",
  EVENT_SESSION_OLD: (sessionId = ":sessionId") => `/session/${sessionId}`,
  EVENT_SESSION: (sessionId = ":sessionId") => `/v/${sessionId}`,

  CREATE_EVENT_SESSION: () => `/new-event`,
  LOGIN_PATH: () => `/login`,
  GO_TO_LOGIN: (callback = "/") => `/login?callback=${callback}`,
  EDIT_PROFILE_RAW: () => `/profile/edit`,
  EDIT_PROFILE: (callback = "/") => `/profile/edit?callback=${callback}`,
  PROFILE: () => "/profile"
};
