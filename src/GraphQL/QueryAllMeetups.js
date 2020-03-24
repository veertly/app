import gql from "graphql-tag";

export default gql(`
query {
  listMeetups(limit: 1000) {
    items {
      id
      title,
      description
      image
    }
  }
}`);
