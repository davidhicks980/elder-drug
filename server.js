//create express middleware
const express = require("express");
const app = express();
const port = 3000;
let server = app.listen(port, () =>
  console.log(`Elder Drug listening on port ${port}!`)
);
const compression = require("compression");

app.use(compression);
app.use(express.static(__dirname + "/public"));

var socket = require("socket.io");
var mysql = require("mysql");
const bodyParser = require("body-parser");
const querystring = require("querystring");
const { Output } = require("@angular/core");
let dropdownItems = [];

app.use(bodyParser.urlencoded({ extended: true }));

const dbhost = process.env.MYSQL_SERVICE_HOST;
const dbport = process.env.MYSQL_SERVICE_PORT;
const dbuser = process.env.MYSQL_USER;
const dbpwd = process.env.MYSQL_PASSWORD;
const dbname = process.env.MYSQL_DATABASE;
const conn = mysql.createConnection({
  host: dbhost,
  user: dbuser,
  password: dbpwd,
  database: dbname,
});

var io = socket(server);

io.on("connection", function (socket) {
  console.log("socket connection successful");

  let stem;
  socket.on("drugs-to-filter", function (drugs) {
    let primaryOutput = dropdownItems.filter((item) => {
      return item.startsWith(drugs);
    });
    io.emit("filter", primaryOutput);
  });

  socket.on("drugs-to-search", function (drugs) {
    let queryArray = [];
    for (let drug of drugs) {
      if (drug.length > 2) {
        queryArray.push(`lower(di.DrugExamples) = lower('${drug}')`);
      }
    }
    const stringlist = JSON.stringify(queryArray);
    const querylist = stringlist.replace(/\",\"/g, " OR ");
    const sql = `SELECT DISTINCT
    all_guidance.*, di.DrugExamples as SearchTerm
  FROM
    dropdown_index_a di
  RIGHT JOIN all_guidance ON
    di.EntryID = all_guidance.EntryID
    WHERE ${JSON.parse(querylist)}`;
    conn.query(sql, function (err, result) {
      let diseaseGuidanceTable = result.filter((item) => item.Category == 3);
      let drugInteractionTable = result.filter((item) => item.Category == 5);
      let clearanceTable = result.filter((item) => item.Category == 6);

      const output = {
        Clearance: clearanceTable,
        DrugInteraction: drugInteractionTable,
        DiseaseGuidance: diseaseGuidanceTable,
        GeneralInfo: result,
      };

      if (err) null;
      io.emit("search-results", output);
    });
  });
});

conn.connect(function (err) {
  if (err) console.log(err);
  console.log("Howdy, you are connected to the MySQL Database");
  let sql = `SELECT DISTINCT Items FROM dropdown_items`;
  conn.query(sql, function (err, rawDropdownOptions) {
    if (err) console.log(err);
    let i;
    let length = rawDropdownOptions.length;
    for (i = 0; i < length; i++) {
      dropdownItems.push(rawDropdownOptions[i].Items.toLowerCase());
    }
  });
});
