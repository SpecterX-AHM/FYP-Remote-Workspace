var admin = require("firebase-admin");
const User = require('../models/user');
require("dotenv").config();

// required for configuring firebase admin sdk
var serviceAccount = {
  type: process.env.REACT_APP_type,
  project_id: process.env.REACT_APP_project_id,
  private_key_id: process.env.REACT_APP_private_key_id,
  private_key: process.env.REACT_APP_private_key,
  client_email: process.env.REACT_APP_client_email,
  client_id: process.env.REACT_APP_client_id,
  auth_uri: process.env.REACT_APP_auth_uri,
  token_uri: process.env.REACT_APP_token_uri,
  auth_provider_x509_cert_url: process.env.REACT_APP_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.REACT_APP_client_x509_cert_url
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const getTokenDetails = async(token) => {
  const details = await admin.auth().verifyIdToken(token).then(async(decodedToken) => {
    const decoded = await User.findOne({'user_id' : decodedToken.user_id}).then((result)=> {
    return result;
    })
    return decoded
 })
 return details
}

module.exports = getTokenDetails;