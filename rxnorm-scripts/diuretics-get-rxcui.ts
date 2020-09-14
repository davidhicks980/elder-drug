import { readFile, writeFileSync } from 'fs';
import { fetch } from 'cross-fetch';
let inFile = './json-out/diuretics.json';
let outFile = './json-out/diuretics-generics-dropdown.json';
let outArray = [];
let antidepressives = [181];
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
            for (let id of antidepressives)
              outArray.push({
                name: name,
                rxcui: res.idGroup.rxnormId[0],
                id: id,
              });

            if (outArray.length / antidepressives.length === output.length) {
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
