//create express middleware
const express = require("express");
const app = express();
const port = 8080;
let server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

app.use(express.static(__dirname + "/public"));

var socket = require("socket.io");
var mysql = require("mysql");
const bodyParser = require("body-parser");
const querystring = require("querystring");
let dropDownItems = [];

app.use(bodyParser.urlencoded({ extended: true }));

//If your database service name is "FOO", then this would be "FOO_SERVICE_HOST" and "FOO_SERVICE_PORT"
/*const dbhost = process.env.MYSQL_SERVICE_HOST;
const dbport = process.env.MYSQL_SERVICE_PORT;
const dbuser = process.env.MYSQL_USER;
const dbpwd = process.env.MYSQL_PASSWORD;
const dbname = process.env.MYSQL_DATABASE;
const conn = mysql.createConnection({   
    host:     dbhost,
    user:     dbuser,
    password: dbpwd,
    database: dbname
})*/

var io = socket(server);

const conn = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "davicks",
  password: "burrito7",
  database: "geridb",
});

function hasNumbers(t) {
  var regex = /\d/g;
  return regex.test(t);
}

function dropDown() {
  let sql = "SELECT Items FROM dropdown_items";
  let dropDownItems = [];
  conn.query(sql, function (err, result) {
    if (err) console.log(err);
    for (item of result) {
      dropDownItems.push(item.PharmClasses);
    }
  });
  io.emit("dropDown", dropDownItems);
}

io.on("connection", function (socket) {
  console.log("socket connection successful");
  let stem;
  socket.on("drugs-to-filter", function (drugs) {
    if (drugs.length === 3 && drugs.substring(0, 3) != stem) {
      let sql = `SELECT DISTINCT Items FROM dropdown_items WHERE UPPER(Items) like UPPER('%${drugs}%')`;
      stem = drugs.substring(0, 3);
      console.log(stem);
      conn.query(sql, function (err, result) {
        if (err) console.log(err);
        io.emit("filter", result);
      });
    }
  });

  socket.on("drugs-to-search", function (drugs) {
    console.log(drugs);
    let queryArray = [];
    for (let drug of drugs) {
      if (drug.length > 2) {
        queryArray.push(`lower('%${drug}%')`);
      }
    }
    let stringlist = JSON.stringify(queryArray);
    let querylist = stringlist.replace(/\",\"/g, " OR ");
    let item;
    let sql = `SELECT DISTINCT
all_guidance.*
  FROM
    dropdown_index di
  RIGHT JOIN all_guidance ON
    di.EntryID = all_guidance.EntryID
    WHERE di.DrugExamples like ${JSON.parse(querylist)}`;
    conn.query(sql, function (err, result) {
      if (err) null;
      console.log("emit");
      io.emit("search-results", result);
    });
  });
});

conn.connect(function (err) {
  if (err) console.log(err);
  console.log("Connected!");
});

/*app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/about", (req, res) => res.sendFile(__dirname + "/pages/about.html"));
*/
/*queries = {
    cardQuery:  `SELECT EntryID as id,
                        TableNumber as location,
                        DiseaseState as disease,
                        TherapeuticCategory as category,
                        Class as class,
                        Drug as drugName,
                        Inclusion as inclusion,
                        Exclusion as exclusion,
                        Rationale as rationale,
                        Recommendation as recommendation
                    FROM drug_info
                    WHERE Drug LIKE ?
                    ORDER BY TableNumber `,
    connect: () => {
        const dbport = process.env.MYSQL_SERVICE_PORT;
        const dbuser = process.env.MYSQL_USER;
        const dbpwd = process.env.MYSQL_PASSWORD;
        const dbname = process.env.MYSQL_DATABASE;
        return connection = mysql.createConnection({
            host:     dbhost,
            user:     dbuser,
            password: dbpwd,
            database: dbname
        })
    },
    getData: (conn, sql) => {
        var entries = [];
        return conn.query(sql, function(err, result, fields) {
            if(err) throw err;
            return entries = result
        })
    },


}
*/
