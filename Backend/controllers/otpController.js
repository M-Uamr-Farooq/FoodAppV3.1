const transporter = require('../config/mailer');
const otpStore = require('../utils/otpStore');

exports.sendOtp = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email.trim()] = { otp, expiry: Date.now() + 60000 };

  transporter.sendMail({
    from: 'shanisipra428@gmail.com',
    to: email,
    subject: 'Your OTP for Restaurant Registration',
    text: `Your OTP is ${otp}. It is valid for 1 minute.`,
  }, (error) => {
    if (error) return res.status(500).json({ message: 'Failed to send OTP.' });
    res.status(200).json({ message: 'OTP sent successfully!' });
  });
};
