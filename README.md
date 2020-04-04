# Introduction

Veertly is a virtual conference platform focused on the networking of the participants. When entering a veertly conference, participants can attend the traditional virtual webinar (aka Conference Room) or network with other participants on the "Networking Area".

On the networking area participants can check who is available and whos is talking with whom, like in a real event. They can then choose to join an existing conversation or start a new one with someone that is available.

You can test the live version on our Demo conference room: https://app.veertly.com/session/demo

# How does it work

## Conference Room

At the moment, the conference room is a [Jitsi](https://meet.jit.si/) room where all participants are connected.

In the near future, we pretend to optimize the conference room by having a live stream being shared by the speakers of the conference where all participants can attend and ask questions.

## Networking Area

Each conversation in the networking area has its own [Jitsi](https://meet.jit.si/) room. When a participant selects someone to talk a new room is created and both participants join that room. If someone else wants to join that conversation, they will simply join the Jitsi room.

# How to contribute

We decided to open source this project in order to have a collaborative effort to help us in this new way of living due to the Coronavirus outbreak. We believe that together we will go further and that we will be able to do build something great to allow us to have more meaningful connections virtualy!

All the code used for this application is hosted here and the front-end client is a ReactJS application. On the backend, we use [Firestore](https://firebase.google.com/docs/firestore) database, from Firebase.

If you need any help hosting Veertly on your environment, please do not hesitate to contact me @joaoaguiam on twitter or telegram.
