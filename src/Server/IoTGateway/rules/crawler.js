/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/*相関函式庫*/
var clock=require("../modules/clock.js");
var httpServer=require("../modules/httpServer.js");
var database=require("../modules/database.js"); 
var xss = require("xss");

/*資料庫*/
var cnDB=null;
var app=httpServer.app();

/*查詢己爬蟲爬到的資料*/
// GET /crawler/AQI/ALL => 全部測站的資料
app.get("/crawler/AQI/ALL", async function(req, res) {
    var statusSQL = `SELECT siteid,sitename,aqi,monitordate FROM AQX_P_434 ORDER BY siteid ASC;`;
    var currentTime = new Date().toLocaleString();
    console.log(`[${currentTime}] HTTP GET /crawler/AQI/ALL`);

    var cnDB = database.cnDB();
    const connection = await cnDB.getConnection(); // 從連接池中獲取一個連接

    try {
        const results = await connection.query(statusSQL, { cache: false }); // 執行 SQL 查詢
        const formattedResults = results[0].map(item => ({
            ...item,
            monitordate: clock.formatDateToYYYYMMDD(item.monitordate) // 格式化日期
        }));
        var data = JSON.stringify(formattedResults);
        res.send(data);
        console.log(`[${currentTime}] ${data}`);
    } catch (error) {
        console.error(`[${currentTime}] Failed to execute query: ${error.message}`);
        const responseMeta = { code: "-1" };
        res.send(responseMeta);
        throw error;
    } finally {
        connection.release(); // 釋放連接
    }
});

// GET /crawler/AQI/site => 指定特定測站的資料
app.get("/crawler/AQI/site", async function(req, res) {
    const sitename = database.escape(req.query.sitename);
    var statusSQL = `SELECT siteid,sitename,aqi,monitordate FROM AQX_P_434 WHERE sitename = ${sitename} ORDER BY siteid ASC;`;
    var currentTime = new Date().toLocaleString();
    console.log(`[${currentTime}] HTTP GET /crawler/AQI/site`);

    var cnDB = database.cnDB();
    const connection = await cnDB.getConnection(); // 從連接池中獲取一個連接

    try {
        const results = await connection.query(statusSQL, { cache: false }); // 執行 SQL 查詢
        const formattedResults = results[0].map(item => ({
            ...item,
            monitordate: clock.formatDateToYYYYMMDD(item.monitordate) // 格式化日期
        }));
        var data = JSON.stringify(formattedResults);
        res.send(data);
        console.log(`[${currentTime}] ${data}`);
    } catch (error) {
        console.error(`[${currentTime}] Failed to execute query: ${error.message}`);
        const responseMeta = { code: "-1" };
        res.send(responseMeta);
        throw error;
    } finally {
        connection.release(); // 釋放連接
    }
});

