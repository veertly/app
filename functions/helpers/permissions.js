const { firestore /* admin */ } = require("../modules/firebase");

module.exports = {};

module.exports.isEventOwner = async (eventSessionId, userId) => {
  const eventSessionDetailsRef = firestore
    .collection("eventSessionsDetails")
    .doc(eventSessionId);

  let eventSessionDetails = (await eventSessionDetailsRef.get()).data();
  console.log({ eventSessionDetails, userId });
  return eventSessionDetails && eventSessionDetails.owner === userId;
};
