import { readFile, createWriteStream, writeFileSync, WriteStream } from 'fs';
let out = createWriteStream('./all-generics-items.json');

let dropdownPaths = [
  './json-out/generic-class-dropdown.json',
  './json-out/generics-dropdown.json',
  './json-out/antipsychotics-generics-dropdown.json',
  './json-out/anticholinergic-generics-dropdown.json',
  './json-out/diuretics-generics-dropdown.json',
  './json-out/antispasmodics-generics-dropdown.json',
  './json-out/antidepressives-generics-dropdown.json',
];

writeFileSync('./all-generics-items.json', '');

function combineFiles(paths: string[], out: WriteStream) {
  let outData = [];
  let i = 0;
  for (let path of paths) {
    readFile(path, (err, data) => {
      let parsedData = JSON.parse(data.toString());
      for (let item of parsedData) {
        
        let rxcui = item.rxnormId ? item.rxnormId[0] : item.rxcui;
        outData.push({
          id: item.id,
          name: item.name,
          url: `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/related.json?tty=bn`,
        });
        console.log( rxcui);
      }
      i++;
      if (i === paths.length) {
        out.write(JSON.stringify([...outData]));
      }
    });
  }
}
combineFiles(dropdownPaths, out);
