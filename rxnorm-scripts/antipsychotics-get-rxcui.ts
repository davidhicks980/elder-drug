import { readFile, writeFileSync, createWriteStream, write } from 'fs';
import { fetch } from 'cross-fetch';
let inFile = './json-out/antipsychotics.json';
let outFile = './json-out/antipsychotics-generics-dropdown.json';
let outArray = [];
let antipsychotics = [137, 155, 157, 169, 179, 200, 52];
async function importFileToObj(file: string) {
  let output;
  readFile(file, async (err, data) => {
    if (err) console.log(err);
    output = JSON.parse(data.toString());
    for (let item of output) {
      let name = item.name;
      try {
        await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${name}`)
          .then((res) => res.json())
          .then((res) => {
            for (let id of antipsychotics)
              outArray.push({
                name: name,
                rxcui: res.idGroup.rxnormId[0],
                id: id,
              });

            if (outArray.length / antipsychotics.length === output.length) {
              writeInfoOut(outArray, outFile);
            }
          });
      } catch (err) {
        console.log(err);
      }
    }
  });
}

function writeInfoOut(array: any[], file: string) {
  writeFileSync(file, JSON.stringify(array));
}

importFileToObj(inFile);
