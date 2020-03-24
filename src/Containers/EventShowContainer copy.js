import React from "react";
import QueryGetMeetup from "../GraphQL/QueryGetMeetup";
import Meetup from "../Components/Meetup";
import { useQuery } from "@apollo/react-hooks";
import FullTopbar from '../Containers/Layouts/FullTopbar';
import EventShow from '../Components/EventShow/EventShow';
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import * as firebase from "firebase";
import CenteredLayout from './Layouts/CenteredLayout';

function EventShowContainer (props) {
  const eventSlug = props.match.params.id
  const pathname = props.location.pathname
  console.log("props", props)

  const [user, loadingUser, errorUser] = useAuthState(firebase.auth());
  const [event, loadingEvent, errorSession] = useDocumentData(
    firebase
      .firestore()
      .collection("events")
      .doc(eventSlug)
  );
  if (errorSession) {
    console.error(errorSession);
    return <p>Error :(</p>;
  }

  if (loadingEvent || loadingUser) {
    return <p>Loading...</p>;
  }

  console.log(event);
  return <CenteredLayout><EventShow user={user} eventId={eventSlug} event={event} /></CenteredLayout>
}

export default EventShowContainer;
