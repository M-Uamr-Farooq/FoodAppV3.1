const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: 'shanisipra428@gmail.com',
    pass: 'oaqf rwba qrkj isxb',
  },
  // logger: true,
  // debug: true,
});


module.exports = transporter;
