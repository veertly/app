import { VERTICAL_NAV_OPTIONS } from "../Contexts/VerticalNavBarContext";

export const isParticipantMainStage = (participantSession) => {
  return (
    participantSession &&
    participantSession.currentLocation === VERTICAL_NAV_OPTIONS.mainStage
  );
};

export const isParticipantBackstage = (participantSession) => {
  return (
    participantSession &&
    participantSession.currentLocation === VERTICAL_NAV_OPTIONS.backstage
  );
};

export const isParticipantLobby = (participantSession) => {
  return (
    participantSession &&
    participantSession.currentLocation === VERTICAL_NAV_OPTIONS.lobby
  );
};

export const isParticipantAvailableForCall = (participantSession) => {
  return (
    participantSession &&
    participantSession.availableForCall !== false &&
    !participantSession.groupId &&
    participantSession.currentLocation !== VERTICAL_NAV_OPTIONS.mainStage &&
    participantSession.currentLocation !== VERTICAL_NAV_OPTIONS.backstage
  );
};

export const participantCanNetwork = (participantSession) => {
  return (
    participantSession &&
    !participantSession.groupId &&
    participantSession.currentLocation !== VERTICAL_NAV_OPTIONS.mainStage &&
    participantSession.currentLocation !== VERTICAL_NAV_OPTIONS.backstage
  );
};

export const isParticipantOnCall = (
  participantSession,
  eventSessionDetails = null
) => {
  return (
    participantSession &&
    (participantSession.groupId ||
      (participantSession.currentLocation === VERTICAL_NAV_OPTIONS.mainStage &&
        (!eventSessionDetails ||
          eventSessionDetails.conferenceVideoType === "JITSI"))) // TODO: check if not a jitsi conference
  );
};

export const isParticipantOnNetworkingCall = (participantSession) => {
  return participantSession && participantSession.groupId;
};

export const participantHasSubtitle = (participant) =>
  participant.company &&
  (participant.company.trim() !== "" || participant.companyTitle.trim() !== "");

export const participantHasSocials = (participant) => {
  const { twitterUrl, linkedinUrl } = participant;
  return (
    (twitterUrl && twitterUrl.trim() !== "") ||
    (linkedinUrl && linkedinUrl.trim() !== "")
  );
};

export const participantHasFlag = (participant) =>
  participant.locationDetails !== null;
