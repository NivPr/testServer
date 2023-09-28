const mongoose = require("mongoose");
const Joi = require("joi");


const buysSchema = new mongoose.Schema({
  symbol:String,
  type:String,
  units:Number,
  user_id:String,
  USD_value:Number,
  close: Number,
  date: String,
  date_created:{
    type:Date, default:Date.now()
  }
})
exports.buysModel = mongoose.model("buys",buysSchema);

exports.buysValidate = (_reqBody) => {
  let joiSchema = Joi.object({
    symbol:Joi.string().min(2).required(),
    type:Joi.string().min(2).required(),
    units: Joi.number().min(0).required(),
    USD_value: Joi.number().required(),
    close: Joi.number().required(),
    date: Joi.string().required(),
    
  })
  return joiSchema.validate(_reqBody)
}