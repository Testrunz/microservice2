const admin = require('firebase-admin');
const config = require('../config/env');

const serviceAccount = {
    project_id: config.FIREBASE_PROJECT_ID,
    private_key_id: config.FIREBASE_PRIVATE_KEY_ID,
    private_key: config.FIREBASE_PRIVATE_KEY,
    client_email: config.FIREBASE_CLIENT_EMAIL,
    client_id: config.FIREBASE_CLIENT_ID,
    auth_uri: config.FIREBASE_AUTH_URI,
    token_uri: config.FIREBASE_TOKEN_URI,
    client_x509_cert_url: config.FIREBASE_AUTH_CERT_URI,
  };
  
  const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  module.exports = {
    auth: firebase.auth(),
  }