const mongoose = require("mongoose");
const Joi = require("joi");


const actSchema = new mongoose.Schema({
  user_id:String,
  symbol:Number,
  units:String,
  type: String,
  USD_value:Number,
  close: Number,
  date: String,
  date_created:{
    type:Date, default:Date.now()
  }
})
exports.actModel = mongoose.model("acts",actSchema);

exports.actValidate = (_reqBody) => {
  let joiSchema = Joi.object({
    user_id:Joi.string().required(),
    symbol:Joi.string().min(2).required(),
    units: Joi.number().min(0).required(),
    type: Joi.string().required(),
    USD_value: Joi.number().required(),
    close: Joi.number().required(),
    date: Joi.string().required(),
    
  })
  return joiSchema.validate(_reqBody)
}