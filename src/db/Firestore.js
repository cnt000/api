const admin = require('firebase-admin');
// TODO env
const serviceAccount = require('../../pungilandia-firebase-firebase-adminsdk-vnngg-f035cbe9c5.json');

var db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.db = db.firestore();
