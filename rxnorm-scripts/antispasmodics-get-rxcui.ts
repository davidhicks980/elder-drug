import { readFile, writeFileSync, createWriteStream, write } from 'fs';
import { fetch } from 'cross-fetch';
import { promises } from 'dns';
let inFile = './json-out/antispasmodics.json';
let outFile = './json-out/antispasmodics-generics-dropdown.json';
let outArray = [];
let antispasmodics = [199];
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
            for (let id of antispasmodics)
              outArray.push({
                name: name,
                rxcui: res.idGroup.rxnormId[0],
                id: id,
              });

            if (outArray.length / antispasmodics.length === output.length) {
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
