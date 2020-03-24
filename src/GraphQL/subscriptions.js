/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const subscribeToEventComments = `subscription SubscribeToEventComments($eventId: String!) {
  subscribeToEventComments(eventId: $eventId) {
    eventId
    commentId
    content
    createdAt
  }
}
`;
export const onCreateMeetup = `subscription OnCreateMeetup($id: ID, $title: String, $description: String) {
  onCreateMeetup(id: $id, title: $title, description: $description) {
    id
    title
    description
    events {
      nextToken
    }
    imageUrl
  }
}
`;
export const onUpdateMeetup = `subscription OnUpdateMeetup(
  $id: ID
  $title: String
  $description: String
  $image: AWSURL
) {
  onUpdateMeetup(
    id: $id
    title: $title
    description: $description
    image: $image
  ) {
    id
    title
    description
    events {
      nextToken
    }
    imageUrl
  }
}
`;
export const onDeleteMeetup = `subscription OnDeleteMeetup($id: ID, $title: String, $description: String) {
  onDeleteMeetup(id: $id, title: $title, description: $description) {
    id
    title
    description
    events {
      nextToken
    }
    imageUrl
  }
}
`;
export const onCreateEventSession = `subscription OnCreateEventSession($id: ID, $eventId: String) {
  onCreateEventSession(id: $id, eventId: $eventId) {
    id
    eventId
  }
}
`;
export const onUpdateEventSession = `subscription OnUpdateEventSession($id: ID, $eventId: String) {
  onUpdateEventSession(id: $id, eventId: $eventId) {
    id
    eventId
  }
}
`;
export const onDeleteEventSession = `subscription OnDeleteEventSession($id: ID, $eventId: String) {
  onDeleteEventSession(id: $id, eventId: $eventId) {
    id
    eventId
  }
}
`;
export const onCreateLiveGroup = `subscription OnCreateLiveGroup(
  $id: ID
  $jitsiAddress: String
  $startDateTime: AWSDateTime
  $endDateTime: AWSDateTime
) {
  onCreateLiveGroup(
    id: $id
    jitsiAddress: $jitsiAddress
    startDateTime: $startDateTime
    endDateTime: $endDateTime
  ) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const onUpdateLiveGroup = `subscription OnUpdateLiveGroup(
  $id: ID
  $jitsiAddress: String
  $startDateTime: AWSDateTime
  $endDateTime: AWSDateTime
) {
  onUpdateLiveGroup(
    id: $id
    jitsiAddress: $jitsiAddress
    startDateTime: $startDateTime
    endDateTime: $endDateTime
  ) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const onDeleteLiveGroup = `subscription OnDeleteLiveGroup(
  $id: ID
  $jitsiAddress: String
  $startDateTime: AWSDateTime
  $endDateTime: AWSDateTime
) {
  onDeleteLiveGroup(
    id: $id
    jitsiAddress: $jitsiAddress
    startDateTime: $startDateTime
    endDateTime: $endDateTime
  ) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const onCreateParticipantOnline = `subscription OnCreateParticipantOnline(
  $id: ID
  $participantId: ID
  $timeJoined: AWSDateTime
  $liveGroupId: ID
  $eventSessionId: ID
) {
  onCreateParticipantOnline(
    id: $id
    participantId: $participantId
    timeJoined: $timeJoined
    liveGroupId: $liveGroupId
    eventSessionId: $eventSessionId
  ) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
export const onUpdateParticipantOnline = `subscription OnUpdateParticipantOnline(
  $id: ID
  $participantId: ID
  $timeJoined: AWSDateTime
  $liveGroupId: ID
  $eventSessionId: ID
) {
  onUpdateParticipantOnline(
    id: $id
    participantId: $participantId
    timeJoined: $timeJoined
    liveGroupId: $liveGroupId
    eventSessionId: $eventSessionId
  ) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
export const onDeleteParticipantOnline = `subscription OnDeleteParticipantOnline(
  $id: ID
  $participantId: ID
  $timeJoined: AWSDateTime
  $liveGroupId: ID
  $eventSessionId: ID
) {
  onDeleteParticipantOnline(
    id: $id
    participantId: $participantId
    timeJoined: $timeJoined
    liveGroupId: $liveGroupId
    eventSessionId: $eventSessionId
  ) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
