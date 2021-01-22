const express = require("express");

var nodemailer = require('nodemailer');
const app = express();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ifanshakil15@gmail.com',
        pass: 'ifanshakil'
    }
});

var mailOptions = {
    from: 'ifanshakil@gmail.com',
    to: 'pramit9101999@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'Tu chutya lodu hai'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
const port = 6000;
const server = app.listen(port, () =>
    console.log(`server listening  on port ${port}`)
);