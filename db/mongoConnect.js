const mongoose = require('mongoose');
const {config} = require('../config/config.js');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://nivp:${config.mongoPass}@cluster0.xlj5r.mongodb.net/barcode_project`);
  console.log("mongo connect node_pro...")
}