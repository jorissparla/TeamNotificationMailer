const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async ({
  from = 'no-reply@infor.com',
  to,
  subject,
  cc = 'joris.sparla@infor.com',
  content
}) => {
  const host = process.env.MAIL_HOST;
  const port = process.env.MAIL_PORT;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false
  });

  console.log(from, to, subject, content);
  const mailOptions = {
    from,
    to,
    cc,
    subject,
    html: content
  };

  await transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
