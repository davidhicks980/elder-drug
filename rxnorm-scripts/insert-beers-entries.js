"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var fs_1 = require("fs");
var conn = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'davicks',
    password: 'burrito7',
    database: 'geridb'
});
conn.connect(function (err) {
    if (err)
        console.log(err);
    var sql = "select * from all_guidance ag";
    queryBeersEntries(sql);
});
function queryBeersEntries(sql) {
    conn.query(sql, function (err, data) {
        fs_1.writeFileSync('./beers-entries.json', JSON.stringify(data));
    });
}
