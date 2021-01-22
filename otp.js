const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const Nexmo = require("nexmo");
const socketio = require("socket.io");
const app = express();

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
const nexmo = new Nexmo({
  apiKey: "506399e5",
  apiSecret: "6AALWTe92YBbY4Cd"
});

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.static(__dirname + "/views"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/", (req, res) => {
  //   res.send(req.body);
  //   console.log(req.body);
  const from = "38382783287";
  const to = req.body.number;
  const newotp = generateOTP();

  nexmo.message.sendSms(
    from,
    to,
    newotp, {
      type: "unicode"
    },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
  );
  console.dir(responseData);
});

const port = 5000;
const server = app.listen(port, () =>
  console.log(`server listening  on port ${port}`)
);