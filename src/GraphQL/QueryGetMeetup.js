import gql from "graphql-tag";

export default gql(`
query GetMeetup($id: ID!) {
  getMeetup(id: $id) {
    id
    title
    description
    image
  }
}`);
