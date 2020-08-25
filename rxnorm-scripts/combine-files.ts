import { readFile, createWriteStream, writeFileSync, WriteStream } from 'fs';
let dropdownStream = createWriteStream('./all-dropdown-items.json');

let dropdownPaths = [
  './brands-generic-dropdown.json',
  './brands-class-dropdown.json',
  './generic-class-dropdown.json',
  './generics-dropdown.json',
];

writeFileSync('./all-dropdown-items.json', '');

function combineFiles(paths: string[], out: WriteStream) {
  let outData = [];
  let i = 0;
  for (let path of paths) {
    readFile(path, async (err, data) => {
      let parsedData = JSON.parse(data.toString());
      outData.push(...parsedData);
      i++;
      if (i === paths.length) {
        out.write(JSON.stringify([...outData]));
      }
    });
  }
}
combineFiles(dropdownPaths, dropdownStream);
