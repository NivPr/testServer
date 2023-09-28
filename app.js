const express = require("express");
const cors = require('cors');


const path = require("path");

const http = require("http");
require("./db/mongoConnect");

const {routesInit , corsAccessControl} = require("./routes/config_routes");

const app = express();
app.use(cors());


app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   });

// corsAccessControl(app);

routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || "3006";
server.listen(port);