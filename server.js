const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ResModel = require('./models/Res');
const VisitorModel = require('./models/Visitor');
const engine = require('ejs-mate');
const Nexmo = require('nexmo');
const nodemailer = require('nodemailer');
const VisModel = require('./models/Visitor');


const urlencodedParser = bodyParser.urlencoded({ extended:false });

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

mongoose.connect('mongodb://localhost:27017/company', {
    useNewUrlParser : true,
    useUnifiedTopology : true
});


  //for texting otp
  const nexmo = new Nexmo({
    apiKey: "506399e5",
    apiSecret: "6AALWTe92YBbY4Cd"
  });


app.get('/', (req,res)=>{
    res.render('visitors.ejs');
});

app.post('/', urlencodedParser, (req, res)=>{
    res.redirect('/checkIn');
});

// app.post('/', (req, res)=>{
//     res.redirect('/otpPage');
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ifanshakil15@gmail.com',
        pass: 'ifanshakil'
    }
});

app.get('/checkIn', (req,res)=>{
    res.render('animation.ejs');
});

app.post('/checkIn', urlencodedParser, (req,res)=>{
    console.log(req.body);
    const number = req.body.number;
    function generateOTP() {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }
    const newotp = generateOTP();

    var currentdate = new Date();
    var datetime = "24/12/19" + " @ " 
        + currentdate.getHours() + ":" 
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    const user = new VisModel({ Name:req.body.name,
    phone_no:number,
    otp:newotp,
    intime:datetime});

    console.log(newotp);

    user.save((err,obj)=>{
        if(err)
        console.log("cant save");

        console.log(obj);
    });

    const visitWho = req.body.visitWho;
    let email;

    ResModel.findOne({Name:visitWho},(err,obj)=>{
        if(err)
        console.log(err);
        
        email = obj.email;
        console.log(obj);
        console.log(email);
        //correct
        const mailOptions = {
            from: 'ifanshakil@gmail.com',
            to: email,
            subject: 'New Visitor',
            text: `Koi ${req.body.name} terese milne aaya hai!`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });

    //this is for sending otp to your number
    const from = "38382783287";
    const to = `91${number}`;

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
    // console.dir(responseData);
    res.redirect('/');
});

app.get('/otpPage',(req,res)=>{
    res.render('nextani.ejs');
});

app.post('/otpPage',urlencodedParser, (req,res)=>{
    const num = req.body.otp;
    // if(num==newotp){
    //     console.log("Gazab! Upar ja ab.");
    // }
    var currentdate = new Date();
    var datetime = "24/12/19" + " @ " 
        + currentdate.getHours() + ":" 
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    
    VisModel.updateOne({otp:num}, {outime:datetime}, (err,res)=>{
        if(err){
            console.log('kat gaya');
            return;
        }
        console.log(res);
    });
    res.redirect('/');
});

app.get('/Log', (req,res)=>{
    VisitorModel.find({}, (err,users)=>{
        if(err){
            throw err;
        }
        res.render('manage.ejs',{users});
    });
});

app.listen(3000, ()=>{
    console.log(`server is listening on 3000`);
});

