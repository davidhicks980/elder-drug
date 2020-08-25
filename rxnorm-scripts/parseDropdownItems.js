const fs = require("fs");
let obj = {};
let jsonMap = {};

const writeJSONtoFile = (map) => {
  fs.writeFile("./dropdownIndex.json", JSON.stringify(map), (err) => {
    if (err) throw err;
  });
};

const writeMap = (call) => {
  fs.readFile("./class-dropdown-generic.json", (err, data) => {
    if (err) throw err;
    let expandObj = (obj) => {
      let map = [];
      let outObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          if (element.hasOwnProperty("drugMemberGroup")) {
            let root = element.drugMemberGroup.drugMember;
            root.forEach((element) => {
              let generic = element.minConcept.name;
              let cui = element.minConcept.rxcui;
              map.push({
                index: `pdi` + index,
                dailyMedClass: key,
                name: generic,
                rxcui: cui,
              });
              index++;
            });
          }
        }
      }
      return map;
    };

    let index = 0;

    obj = JSON.parse(data);
    let mappedData = { ClassMatch: [] };
    mappedData.ClassMatch = expandObj(obj);
    call(mappedData);
  });
};
writeMap(writeJSONtoFile);
