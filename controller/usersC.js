const { validateUser, UserModel, validateLogin, genToken } = require("../models/userModel");
const bcrypt = require("bcrypt");


const users_check= (req,res) =>{
    res.json({msg: "workk123"});
}
const checkToken = async(req,res) => {
    return res.json({status:"ok",role:req.tokenData.role,name:"niv"});
  }


  const signUp = async(req,res) => {let validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password,10);
    await user.save();
    user.password = "*****"
    res.status(200).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({code:11000,err_msg:"Email already in system"})
    }
    res.status(500).json({err_msg:"There is probelm , try again later"})

  }
}
const userInfo = async(req,res) => {
  try{ 
    let user = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(500).json({err_msg:"There is probelm , try again later",err})

  }
} 

const login = async(req,res) => {
  let validBody = validateLogin(req.body)
  
  
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    // check if there email with this user
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(401).json({msg:"User not found !"})
    }
    // check password
    let validPassowrd = await bcrypt.compare(req.body.password, user.password);
    if(!validPassowrd){
      
      return res.status(401).json({msg:"Password worng !"})
    }
    // generate and send token
    let token = genToken(user.id,user.role);
    res.json({token,user:{userName:user.userName,role:user.role}});
  }
  catch(err){
  
    res.status(500).json({err_msg:"There is probelm , try again later"})

  }
}

const loginViaMail = async (req,res) =>{
  try{
    let user = await UserModel.findOne({email:req.query.email});
    let validPassowrd = await bcrypt.compare(req.query.code, user.varification);
    if(!validPassowrd){
      res.status(500).json({no:"no"});return
    }
    let token = genToken(user.id,user.role);
    res.status(201).json({token,user:{name:user.name,role:user.role}});
  }
  catch{
    res.status(500).json({no:"no"})
  }
}


module.exports = {
  users_check,
  checkToken,
  signUp,
  userInfo,
  login,
  loginViaMail
};

