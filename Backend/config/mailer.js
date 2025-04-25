const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shanisipra428@gmail.com',
    pass: 'oaqf rwba qrkj isxb',
  },
});

module.exports = transporter;
