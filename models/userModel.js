const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name:String,
  role:{
    type:String, default:"user"
  },
  email:String,
  password:String,
  varification:String,
  
  created_at:{
    type:Date, default:Date.now()
  }
 
})

exports.UserModel = mongoose.model("users",userSchema);

exports.genToken = (_id,role) => {
  let token = jwt.sign({_id,role}, "nivoscrypt",{expiresIn:"600mins"});
  return token;
} 

exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(99).required(),
    
  })
  return joiSchema.validate(_reqBody)
}

// for update user, not allowed to send password
exports.validateEditUser = (_reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    email:Joi.string().min(2).max(150).email().required(),
    phone:Joi.string().min(9).max(99).required(),
    role:Joi.string().min(2).max(99)
  })
  return joiSchema.validate(_reqBody)
}


exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email:Joi.string().min(2).max(150).email().required(),
    password:Joi.string().min(3).max(99).required(),
  })
  return joiSchema.validate(_reqBody)
}