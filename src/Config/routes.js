export default {
  HOME: () => `/`,
  LIST_MEETUPS: () => `/meetups`,
  MEETUP_PAGE: (id = ":id") => `/meetup/${id}`,
  EVENT_PAGE: (id = ":id") => `/events/${id}`,
  TEST_JITSI: () => "/test-jitsi",
  EVENT_SESSION: (sessionId = ":sessionId") => `/session/${sessionId}`,
  LOGIN_PATH: () => `/login`,
  GO_TO_LOGIN: (callback = "/") => `/login?callback=${callback}`,
  EDIT_PROFILE_RAW: () => `/profile/edit`,
  EDIT_PROFILE: (callback = "/") => `/profile/edit?callback=${callback}`,
  PROFILE: () => "/profile"
};
