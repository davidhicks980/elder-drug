const fs = require("fs");
var https = require("https");

let dropdownItems = [];


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
