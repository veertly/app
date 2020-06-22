const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

module.exports = { firestore, admin };
