const admin = require('firebase-admin');

var db = admin.initializeApp();

module.exports.db = db.firestore();
