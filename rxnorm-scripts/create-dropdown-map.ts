import { readFile, createWriteStream, writeFileSync, WriteStream } from 'fs';
let dropdownStream = createWriteStream('./dropdown-map.json');

let dropdownPaths = ['all-dropdown-items.json'];

writeFileSync('./dropdown-map.json', '');
let outMap = {};
function combineFiles(paths: string[], out: WriteStream) {
  for (let path of paths) {
    readFile(path, (err, data) => {
      let parsedData = JSON.parse(data.toString());
      for (let item of parsedData) {
        item.name = `${item.name}`.replace(/\s+/g, '__');
        outMap[`${item.name}`] = [];
      }
      for (let item of parsedData) {
        outMap[`${item.name}`].push(item.id);
      }
      for (let item of parsedData) {
        let array = outMap[`${item.name}`];
        outMap[`${item.name}`] = [...new Set(array)];
      }
      writeFileSync('./dropdown-map.json', JSON.stringify(outMap));
    });
  }
}
combineFiles(dropdownPaths, dropdownStream);
