import React from "react";
import QueryGetMeetup from "../GraphQL/QueryGetMeetup";
import Meetup from "../Components/Meetup";
import { useQuery } from "@apollo/react-hooks";

function MeetupContainer(props) {
  const { loading, error, data } = useQuery(QueryGetMeetup, {
    variables: { id: props.match.params.id }
  });
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }

  const meetup = data.getMeetup;
  return <Meetup meetup={meetup} />;
}

export default MeetupContainer;
