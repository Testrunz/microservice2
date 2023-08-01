require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API);

async function mailing(data) {
  try {
    return await sgMail.send(data);
  } catch (error) {
    return error;
  }
}

module.exports = mailing;
