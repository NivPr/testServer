const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require("jsonwebtoken");

const commentSchema = new mongoose.Schema({
  userId:String,
  userName:String,
  symbol:String,
  comment:String,
  date_created:String
  
})

exports.commentModel = mongoose.model("comments",commentSchema);

exports.genToken = (_id,role) => {
  let token = jwt.sign({_id,role}, "nivoscrypt",{expiresIn:"600mins"});
  return token;
} 

exports.validatecomment = (_reqBody) => {
  let joiSchema = Joi.object({
    userName:Joi.string().min(2).max(99).required(),
    userId:Joi.string().min(2).max(150).email().required(),
    symbol:Joi.string().min(3).max(99).required(),
    comment:Joi.string().min(3).max(99).required(),
    date_created:Joi.string().min(3).max(99).required(),
    
  })
  return joiSchema.validate(_reqBody)
}

// for update comment, not allowed to send password
exports.validateEditcomment = (_reqBody) => {
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