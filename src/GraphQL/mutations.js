/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = `mutation CreateEvent(
  $name: String!
  $when: String!
  $where: String!
  $description: String!
) {
  createEvent(
    name: $name
    when: $when
    where: $where
    description: $description
  ) {
    id
    name
    where
    when
    meetup {
      id
      title
      description
      imageUrl
    }
    description
    comments {
      nextToken
    }
  }
}
`;
export const deleteEvent = `mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id) {
    id
    name
    where
    when
    meetup {
      id
      title
      description
      imageUrl
    }
    description
    comments {
      nextToken
    }
  }
}
`;
export const commentOnEvent = `mutation CommentOnEvent($eventId: ID!, $content: String!, $createdAt: String!) {
  commentOnEvent(eventId: $eventId, content: $content, createdAt: $createdAt) {
    eventId
    commentId
    content
    createdAt
  }
}
`;
export const addEventToMeetup = `mutation AddEventToMeetup($meetupId: ID!, $input: CreateEventInput!) {
  addEventToMeetup(meetupId: $meetupId, input: $input) {
    id
    name
    where
    when
    meetup {
      id
      title
      description
      imageUrl
    }
    description
    comments {
      nextToken
    }
  }
}
`;
export const createMeetup = `mutation CreateMeetup($input: CreateMeetupInput!) {
  createMeetup(input: $input) {
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
export const updateMeetup = `mutation UpdateMeetup($input: UpdateMeetupInput!) {
  updateMeetup(input: $input) {
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
export const deleteMeetup = `mutation DeleteMeetup($input: DeleteMeetupInput!) {
  deleteMeetup(input: $input) {
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
export const createEventSession = `mutation CreateEventSession($input: CreateEventSessionInput!) {
  createEventSession(input: $input) {
    id
    eventId
  }
}
`;
export const updateEventSession = `mutation UpdateEventSession($input: UpdateEventSessionInput!) {
  updateEventSession(input: $input) {
    id
    eventId
  }
}
`;
export const deleteEventSession = `mutation DeleteEventSession($input: DeleteEventSessionInput!) {
  deleteEventSession(input: $input) {
    id
    eventId
  }
}
`;
export const createLiveGroup = `mutation CreateLiveGroup($input: CreateLiveGroupInput!) {
  createLiveGroup(input: $input) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const updateLiveGroup = `mutation UpdateLiveGroup($input: UpdateLiveGroupInput!) {
  updateLiveGroup(input: $input) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const deleteLiveGroup = `mutation DeleteLiveGroup($input: DeleteLiveGroupInput!) {
  deleteLiveGroup(input: $input) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const createParticipantOnline = `mutation CreateParticipantOnline($input: CreateParticipantOnlineInput!) {
  createParticipantOnline(input: $input) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
export const updateParticipantOnline = `mutation UpdateParticipantOnline($input: UpdateParticipantOnlineInput!) {
  updateParticipantOnline(input: $input) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
export const deleteParticipantOnline = `mutation DeleteParticipantOnline($input: DeleteParticipantOnlineInput!) {
  deleteParticipantOnline(input: $input) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
