const fs = require("fs");
var https = require("https");
var mysql = require("mysql");

let dropdownItems = [];

const conn = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "davicks",
  password: "burrito7",
  database: "geridb",
});

conn.connect(function (err) {
  if (err) console.log(err);
  let sql = `select EntryID, ClassID from all_guidance ag where ItemType <> "drug" and ClassID is not NULL `;
  let i = 0;
  conn.query(sql, function (err, rawDropdownOptions) {
    if (err) console.log(err);
    console.log(rawDropdownOptions);
    for (item of rawDropdownOptions) {
      dropdownItems.push(
        (i++, { EntryID: item.EntryID, ClassID: item.ClassID })
      );
    }
    getDrugs(dropdownItems);
  });
});

let uri = (id) =>
  `https://rxnav.nlm.nih.gov/REST/rxclass/classMembers.json?classId=${id}&relaSource=DAILYMED&rela=has_moa&rela=has_tc`;

const getDrugs = (items) => {
  let lol = 0;
  let output = [];
  console.log("ran");
  let getAllInputs = (i) => {
    let len = i.length;
    i.forEach((value, key) => {
      var request = (url) => {
        https.get(url, (res) => {
          let chunks = [];
          res
            .on("data", function (data) {
              chunks.push(data);
            })
            .on("end", function () {
              const data = Buffer.concat(chunks);
              let parsedDrugObj = {};
              let out = {};
              parsedDrugObj = JSON.parse(data.toString());
              out = {
                id: value.EntryID,
                url: url,
                brands: [],
              };
              if (parsedDrugObj.hasOwnProperty("drugMemberGroup")) {
                let drugMem = parsedDrugObj["drugMemberGroup"]["drugMember"];
                drugMem.forEach((item) => {
                  out.brands.push(item["minConcept"]);
                });
              }
              out["classId"] = parsedDrugObj.userInput["classId"];
              output.push(out);
              lol++;
              if (lol === len) {
                fs.writeFile(
                  "./class-dropdown-generic.json",
                  JSON.stringify(output),
                  (err) => {
                    // throws an error, you could also catch it here
                    if (err) throw err;
                    // success case, the file was saved
                    console.log("complete");
                  }
                );
              }
            });
        });
      };
      request(uri(value["ClassID"]));
    });
  };

  getAllInputs(items);
};
