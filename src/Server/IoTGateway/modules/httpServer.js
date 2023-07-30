var express = require("express");
var swaggerUi = require("swagger-ui-express");
var helmet = require("helmet");
const compression = require("compression");
var ConfigParser = require("configparser");
const swaggerDocument = require("./config/swagger.json");
var clock=require("./clock.js");

/*Server 起始設定*/
const configSet = new ConfigParser();
configSet.read("./modules/config/serviceSet.cfg");
configSet.sections();
var httpServer=express();
var port=configSet.get("Service","HTTP"); 

/*啟用時使用的設定*/
httpServer.use(compression()); //啟用gzip壓縮
httpServer.use(express.urlencoded({ extended: false })); //傳送方式：x-www-form-urlencoded
httpServer.use(express.json()); //傳送方式：json
httpServer.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //API Docs
httpServer.use(helmet()); 
httpServer.disable("x-powered-by"); //關閉X-Powered-By 標頭


/*通訊埠*/
httpServer.listen(port,function(){
    console.log(`[${clock.consoleTime()}] HTTP API Server Started!`);
    console.log(`[${clock.consoleTime()}] HTTP API Server URL: http://[Server_IP]:%s`,port);
});

function app(){
    return httpServer;
}

module.exports={
    app:app,
};