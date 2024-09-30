const express = require('express');
const router = express.Router();
// THIS HAS BEEN ADDED SO CAN BE REMOVED IF NECESSARY
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
// ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
const Walk = require('../models/walk');
// THIS HAS BEEN ADDED SO CAN BE REMOVED IF NECESSARY// ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
require('dotenv').config();
// ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED // ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
// THIS HAS BEEN ADDED SO CAN BE REMOVED IF NECESSARY// ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
const OAUTH_EMAIL = process.env.OAUTH_EMAIL || '';
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || '';
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '';
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN || '';
// THIS HAS BEEN ADDED SO CAN BE REMOVED IF NECESSARY// ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 

router.get('/homehub', async (req, res) => {
  const walks = await Walk.find({});
  res.render('homes/homehub', {walks});
});
router.get('/about', (req, res) => {
  res.render('homes/about');
});
router.get('/contact', (req, res) => {
  res.render('homes/contact');
});
router.get('/contactform', (req, res) => {
  res.render('homes/contactform');
});
router.get('/walks-map', async (req, res) => {
  const walks = await Walk.find({});
  res.render('homes/walksmap', {walks});
});
// THIS HAS BEEN ADDED SO CAN BE REMOVED IF NECESSARY // ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
router.post('/send-email', (req, res) => {
  const { name, email, phone, message } = req.body;

  const oauth2Client = new OAuth2(
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  oauth2Client.setCredentials({
    refresh_token: OAUTH_REFRESH_TOKEN
  });
  const accessToken = oauth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: OAUTH_EMAIL,
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      refreshToken: OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.toString()
    },
  });

  let mailOptions = {
    from: email,
    to: OAUTH_EMAIL,
    subject: `Peaky Blogger - New message from ${name}-${phone}`,
    replyTo: email,
    email: email,
    html: `<h4>${email}</h4> <p>The following message is from PeakyBlogger website from ${email} 
    and the message is:- <br /> <h1>${message}</h1> <br />-- If you want to reply you will have to add their email into the reply </p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log(err);
      return res.status(500).send('Error sending email.');
    } else {
      console.log('Email sent: ' + info.response);
      return res.redirect('/contact');
    }
  });
});
// ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED ADDED 
router.get('/gallery', async (req, res) => {
  const walks = await Walk.find({});
  res.render('homes/gallery', {walks});
});

module.exports = router;

//https://console.cloud.google.com/apis/credentials?project=my-emailer-service
//https://developers.google.com/oauthplayground/?code=4/0AQlEd8yFiXoUc3QRaTasbFQtTVbQyXXUZPsThz1A4e3Q5Zgo49rKlSSMBqwDfNLXWeh6dw&scope=https://mail.google.com/