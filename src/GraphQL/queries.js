/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvent = `query GetEvent($id: ID!) {
  getEvent(id: $id) {
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
export const listEvents = `query ListEvents(
  $filter: TableEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      where
      when
      description
    }
    nextToken
  }
}
`;
export const getMeetup = `query GetMeetup($id: ID!) {
  getMeetup(id: $id) {
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
export const listMeetups = `query ListMeetups(
  $filter: TableMeetupFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeetups(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      imageUrl
    }
    nextToken
  }
}
`;
export const getEventSession = `query GetEventSession($id: ID!) {
  getEventSession(id: $id) {
    id
    eventId
  }
}
`;
export const listEventSessions = `query ListEventSessions(
  $filter: TableEventSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listEventSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      eventId
    }
    nextToken
  }
}
`;
export const getLiveGroup = `query GetLiveGroup($id: ID!) {
  getLiveGroup(id: $id) {
    id
    jitsiAddress
    startDateTime
    endDateTime
  }
}
`;
export const listLiveGroups = `query ListLiveGroups(
  $filter: TableLiveGroupFilterInput
  $limit: Int
  $nextToken: String
) {
  listLiveGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      jitsiAddress
      startDateTime
      endDateTime
    }
    nextToken
  }
}
`;
export const getParticipantOnline = `query GetParticipantOnline($id: ID!) {
  getParticipantOnline(id: $id) {
    id
    participantId
    timeJoined
    liveGroupId
    eventSessionId
  }
}
`;
export const listParticipantOnlines = `query ListParticipantOnlines(
  $filter: TableParticipantOnlineFilterInput
  $limit: Int
  $nextToken: String
) {
  listParticipantOnlines(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      participantId
      timeJoined
      liveGroupId
      eventSessionId
    }
    nextToken
  }
}
`;
