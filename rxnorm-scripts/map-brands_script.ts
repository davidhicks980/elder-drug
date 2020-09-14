import { readFile, createWriteStream, writeFileSync } from 'fs';
import { fetch } from 'cross-fetch';
let inFile = './all-generics-items.json';
let outFile = './all-dropdown-items.json';
let outArray = [];

let outstream = createWriteStream(outFile);
writeFileSync(outFile, '');
outstream.write('[');
function importFileToObj(file: string) {
  readFile(file, async (err, data) => {
    if (err) console.log(err);
    let output = JSON.parse(data.toString());
    for (let item of output) {
      fetch(item.url)
        .then((res) => res.json())
        .then((res) => {
          let concepts = res.relatedGroup.conceptGroup;
          outstream.write(
            JSON.stringify({
              name: item.name,
              rxcui: item.rxcui,
              id: item.id,
            }) + ','
          );
          for (let concept of concepts) {
            if (concept.conceptProperties) {
              for (let brand of concept.conceptProperties) {
                if (brand) {
                  outstream.write(
                    JSON.stringify({
                      generic: item.name,
                      name: brand.name,
                      rxcui: brand.rxcui,
                      id: item.id,
                    }) + ','
                  );
                }
              }
            }
          }
          return outArray;
        })
        .catch(() => {
          console.log(item.name);
          outstream.write(
            JSON.stringify({
              name: item.name,
              rxcui: item.rxcui,
              id: item.id,
            }) + ','
          );
        });
    }
  });
}

importFileToObj(inFile);
