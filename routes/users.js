const express= require("express");
const bcrypt = require("bcrypt");
const { validateUser, UserModel, validateLogin, genToken, validateEditUser } = require("../models/userModel");
const { auth} = require("../middlewares/auth");
const { users_check, checkToken, signUp, userInfo, login, loginViaMail } = require("../controller/usersC");
const nodemailer = require('nodemailer');

const router = express.Router();
router.post("/send",async (req,res)=>{
    try{
      let user = await UserModel.findOne({email:req.body.email});
      if(!user) {res.status(500).json({err:"not found"});return}
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'portfolioplus9@gmail.com',
          pass: 'vyemrtobqcsuujip'
        },
       
      });
      const random = (length) => {
        return Math.random().toString(16).substr(2, length);
    };
    let r= random(6)
      var mailOptions = {
        from: 'portfolio plus',
        to: `niv4499@gmail.com`,
        subject: 'Sending Email using Node.js',
        text: `hi ${user.name}!, your varification code is: ${r}
        http://localhost:3000/loginviamail?email=niv123@gmail.com&code=${r}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    
      });
      user.varification = await bcrypt.hash(r,10);
    await user.save();
    res.status(201).json({yes:"yes"})
    }
      catch{res.status(500).json({yes:"yes"})}
    
    
})

router.get("/", users_check);

router.get("/checkToken" , auth ,checkToken);

router.get("/userInfo" ,auth  ,userInfo);

router.post("/signUp" ,signUp);

router.post("/login" , login);
router.get("/loginViaMail" , loginViaMail);









module.exports = router;