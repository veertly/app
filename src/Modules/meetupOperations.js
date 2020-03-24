import firebase from "./firebaseApp";
import uuidv1 from "uuid/v1";

export const registerNewMeetup = async meetup => {
  await firebase
    .firestore()
    .collection("requestedMeetups")
    .doc(uuidv1())
    .set(meetup);
};

export const subscribeNewsletter = async email => {
  await firebase
    .firestore()
    .collection("subscribeNewsletter")
    .doc(email)
    .set({ email });
};
