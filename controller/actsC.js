const { date, symbol } = require("joi");
const { default: fetch } = require("node-fetch");
const { actModel } = require("../models/actModel");
const { buysModel } = require("../models/buysModel");
const { commentModel } = require("../models/commentModel");
const { saleModel } = require("../models/saleModel");
const { UserModel } = require("../models/userModel");
const { valueByTime, valueByDay, getH_L, getByRange4 } = require("../services/serv");

const add_fav = async (req, res) => {
  try {
    // check if client send in the prop of short_id

    let user = await UserModel.findOne({ _id: req.tokenData._id });
    let favs_ar = user.favs_ar;
    if (favs_ar.includes(req.body._id)) {
      // if found delter from array
      favs_ar = favs_ar.filter(short_id => short_id != req.body.short_id)
    }
    else {
      // if not found add to array
      req.body.date_created = Date.now();
      favs_ar.push(req.body);
      // include max 20 shorts_id
      favs_ar.splice(20, 999);

    }
    let data = await UserModel.updateOne({ _id: req.tokenData._id }, { favs_ar })
    res.json(data);



  }
  catch (err) {
    res.status(500).json({ err_msg: "There is probelm , try again later" })
  }
}


const add_act = async (req, res) => {
  try {

    // The client side did API request to get the the values before buy or sale so we get it from there(req.body)       
    let type = req.body.type;
    let close = req.body.close.toLocaleString();



    // Create object with information about the act
    let actInfo = {
      user_id: req.tokenData._id,
      symbol: req.body.symbol.toUpperCase(),
      close: req.body.close.toLocaleString(),
      units: (req.body.value / close).toLocaleString(),
      USD_value: (req.body.value).toLocaleString(),
      type: req.body.type,
      date: Date.now(),
      date_created: Date.now()
    }


    // save the object on current DB collection and return it to client 
    if (type == "buy") {
      let buyAct = new buysModel(actInfo);
      await buyAct.save()
      res.status(201).json(buyAct);
    }


    else if (type == "sale") {
      let saleAct = new saleModel(actInfo);
      await saleAct.save()
      res.status(201).json(saleAct);
    }


  }
  catch (err) {
    res.status(500).json({ err_msg: "There is probelm , try again later" })
  }
}

const getByTime = async (req, res) => {
  try {
    let min = req.query.min;
    let symbol = req.query.symbol;
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${min}min&apikey=VQINJD5AZ8MYGJZ0`
    let resp = await fetch(url);
    let data = await resp.json();

    res.status(201).json(data)

  }
  catch (err) {
    res.status(500).json({ msg_err: "There problem in server try again later" })
  }

}

const callculate_profits = async (req, res) => {
  try {

    let profits = 0; let units = 0; let spend = 0; let protfolioValue = 0; let pokcket_profit = 0;
    let symbol = req.query.symbol.toUpperCase()
    let prop = await valueByDay(symbol);
    let close = parseFloat(prop[0][1]["4. close"]);

    let buys = await buysModel.find({ user_id: req.tokenData._id, symbol }).sort({ symbol: 1 });

    let sales = await saleModel.find({ user_id: req.tokenData._id, symbol }).sort({ symbol: 1 });
    console.log(buys[buys.length - 1]["date"].slice(0, 10))
    let graphData = getByRange4(prop, buys[0]["date"].slice(0, 10), prop[0][0])
    console.log(buys[0]["date"].slice(0, 10))
    let symbols = await buysModel.aggregate(
      [{ $match: { user_id: req.tokenData._id } },
      { $group: { _id: { symbol: "$symbol" } } }

      ]
    );






    buys.forEach(item => {
      spend += item["USD_value"];
      units += item["units"];
      pokcket_profit -= item["USD_value"]

    });
    console.log({ spend, units, pokcket_profit } + " buys")

    sales.forEach(item => {
      spend -= item["USD_value"];
      units -= item["units"];

      pokcket_profit += item["USD_value"];
    });


    console.log({ spend, units, pokcket_profit } + " sales")


    protfolioValue = units * close
    profits = protfolioValue - spend;
    let profits_precents = (profits / spend) * 100
    let profits_pocket_precents = (pokcket_profit / spend) * 100


    let info = { symbol, profits, protfolioValue, units, spend, close, profits_precents, profits_pocket_precents, pokcket_profit }





    res.status(201).json({ buys, sales, info, graphData, symbols })


  }

  catch (err) { res.status(500).json({ problem: "problem" }) }


}

const getByRange3 = async (req, res) => {
  try {
    let symbol = req.query.symbol;
   
    let ar = await valueByDay(symbol, "FULL");
    let comments = await commentModel.find({symbol:symbol.toUpperCase()});
    console.log(comments)
    let s = req.query.s;
    let e = req.query.e;
    let filterd_ar = getByRange4(ar, s, e)
    
    let close = ar[0][1]["4. close"]
    
    


  
    res.status(201).json({ filterd_ar, close,comments });

  }

  catch {
    res.status(500).json({ problem: "problem" })
  }
}

// const getActsBySymbol = (req,res) =>{
//   try{
//   let symbol = req.query.symbol;
//   let buys = await buysModel.find({user_id:req.tokenData._id,symbol}).sort({symbol:1});
//   let sales = await saleModel.find({user_id: req.tokenData._id,symbol}).sort({symbol:1});
//   res.status(201).json({buys,sales})

// }
// catch{
//   res.status(500).json({problem:"problem"})
// }

// }


const post_comment = async (req, res) => {
  try {
    let date = new Date();
	let current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
	let current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
	let date_time = current_date+" "+current_time;	
	
    let commentObject = {
      userId: req.tokenData._id,
      userName: req.body.userName,
      symbol: req.body.symbol,
      comment: req.body.comment,
      date_created: date_time
    }
    let comment = new commentModel(commentObject);
    await comment.save()
    res.status(201).json(comment);


  }
  catch {
    res.status(500).json({ problem: "problem" })
  }
}

module.exports = {
  add_fav,
  add_act,
  getByTime,
  callculate_profits,
  getByRange3,
  post_comment
}