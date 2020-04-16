import {
  OPEN_EDIT_PROFILE,
  CLOSE_EDIT_PROFILE,
  OPEN_EVENT_DETAILS,
  CLOSE_EVENT_DETAILS,
  OPEN_CHAT,
  CLOSE_CHAT,
  CHAT_RESIZED,
  OPEN_SHARE,
  CLOSE_SHARE,
  OPEN_FEEDBACK,
  CLOSE_FEEDBACK,
} from "./actionTypes";

export const openEditProfile = () => ({
  type: OPEN_EDIT_PROFILE,
});

export const closeEditProfile = () => ({
  type: CLOSE_EDIT_PROFILE,
});

export const openEventDetails = () => ({
  type: OPEN_EVENT_DETAILS,
});

export const closeEventDetails = () => ({
  type: CLOSE_EVENT_DETAILS,
});

export const closeChat = () => ({
  type: CLOSE_CHAT,
});

export const openChat = () => ({
  type: OPEN_CHAT,
});
export const chatResized = (newWidth) => ({
  type: CHAT_RESIZED,
  newWidth,
});

export const openShare = () => ({
  type: OPEN_SHARE,
});

export const closeShare = () => ({
  type: CLOSE_SHARE,
});

export const openFeedback = () => ({
  type: OPEN_FEEDBACK,
});

export const closeFeedback = () => ({
  type: CLOSE_FEEDBACK,
});
