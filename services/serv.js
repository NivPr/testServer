
const { default: fetch } = require("node-fetch");
const { buysModel } = require("../models/buysModel");
const { saleModel } = require("../models/saleModel");
const key  = "I-63YE5TL5KLVE";

const valueByTime = async(symbol)=>{
let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${key}`
let data = await doApiGet(url,"Time Series (1min)");
let ar = convertToArr(data)
console.log(ar[0])

return(ar[0]);

}

const valueByMonth = async(symbol)=>{
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${key}`
    let data = await doApiGet(url,"Monthly Time Series");
    
    return(convertToArr(data));
}

const valueByDay = async(symbol,outputSize) =>{
    console.log(("data")); 
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${key}&outputsize=${outputSize}`;
    let data = await doApiGet(url,"Time Series (Daily)");
    return(convertToArr(data));

}


const convertToArr = (data)=>{
    let obj = data;
    let ar = Object.entries(obj);
    
    // console.log(ar)
    return (ar);
}
const doApiGet = async (url, by) =>{
let resp =  await fetch(url);
let data = await resp.json();
return data[by];
}

const getByRange = async(symbol,s,e) =>{
    let daily_ar= await valueByDay(symbol,"full");
    let eFound = false;
    let max = daily_ar[i]
   let min= daily_ar[i]
    let ar =[];
    let startIndex;
    let endIndex;

    
let i;
  for(i=1; i<daily_ar.length; i++){
    if(daily_ar[i][0]==e){
        endIndex=i;
        max = daily_ar[i]
        min= daily_ar[i]
        break;
        
    }
  }
  let close=0;
for(i=endIndex; daily_ar[i][0]!=s; i++){
    ar.push(daily_ar[i]);
   close = parseFloat (daily_ar[i][1]["4. close"])
    if(close>parseFloat (max[1]["4. close"])) 
    max = daily_ar[i];

    if(close<parseFloat (min[1]["4. close"]))
    min = daily_ar[i];
}
if(daily_ar[i][0]==s) ar.push(daily_ar[i])

 
    
  return(ar);   

    }

    const getByRange2 = async(symbol,s,e) =>{
    
       const sUnix = new Date(s);
       const eUnix = new Date(e);
        let filter_ar = []
        let i = 0;
       
       let ar = await valueByDay(symbol,"full");
        while(new Date (ar[i][0])> eUnix) i++;
        while(new Date (ar[i][0])> sUnix) {
            filter_ar.push(ar[i]);
            i++;
        };
        if(ar[i][0]=s) filter_ar.push(ar[i])
        return filter_ar
       
    }

   const getByRange4 = (ar,s,e) =>{
    const sUnix = new Date(s);
       const eUnix = new Date(e);
        let filter_ar = []
        let i = 0;
       
       
        while(new Date (ar[i][0])> eUnix) i++;
        while(new Date (ar[i][0])> sUnix) {
            filter_ar.push(ar[i]);
            i++;
        };
        if(ar[i][0]=s) filter_ar.push(ar[i])
        return filter_ar;
   }
const fetchFromDB = async (symbol,user_id)=>{


   let buys = await buysModel.find({user_id,symbol}).sort({symbol:1});
        
   let sales = await saleModel.find({user_id,symbol}).sort({symbol:1});

   console.log(buys[buys.length-1]["date"].slice(0,10))
   console.log(buys[0]["date"].slice(0,10))
  let symbols=  await buysModel.aggregate(
   [ { $match : { user_id} },
     {$group: {_id:{symbol:"$symbol"}}}
  
   
   ]
  );
   return{buys,sales,symbols}
}
  





module.exports = {
    valueByTime,
    valueByMonth,
    valueByDay,
    getByRange,
    getByRange2,
    getByRange4,
    fetchFromDB
    
}