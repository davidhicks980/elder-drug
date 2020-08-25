import { createWriteStream, writeFileSync } from 'fs';
import { fetch } from 'cross-fetch';
var mysql = require('mysql');
const dropdownPath = 'brands-generic-dropdown.json';
const itemsPath = 'drug-items.json';
const genericsDropdownPath = 'generics-dropdown.json';

//clear dropdown file
writeFileSync(dropdownPath, '');
//clear generics file
writeFileSync(genericsDropdownPath, '');

let genericStream = createWriteStream(genericsDropdownPath);
let stream = createWriteStream(dropdownPath);
const conn = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'davicks',
  password: 'burrito7',
  database: 'geridb',
});
conn.connect(function (err) {
  if (err) console.log(err);
  let sql = `select EntryID, Item from all_guidance ag where ItemType = "drug"  `;
  queryGenericIDs(sql);
});

const brandURI = (cui): string =>
  `https://rxnav.nlm.nih.gov/REST/rxcui/${cui}/related.json?tty=bn`;
const cuiURI = (name): string =>
  `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${name}`;

async function getBrandsFromURL(obj) {
  let url = obj['uri'];
  obj.brands = [];
  return await fetch(url)
    .then((res) => res.json())
    .then((parsed) => {
      for (let key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          const element = parsed[key];
          for (let ele of element.conceptGroup) {
            if (ele.hasOwnProperty('conceptProperties')) {
              const el = ele['conceptProperties'];
              for (let l of el) {
                obj.brands.push({
                  name: l.name,
                  rxcui: l.rxcui,
                });
                let brandChunk = {
                  name: l.name,
                  rxcui: l.rxcui,
                  id: obj.id,
                  parentRxNormId: obj.rxnormId,
                };
                stream.write(`${JSON.stringify(brandChunk)},`);
              }
            }
          }
        }
      }
      return obj;
    });
}

function queryGenericIDs(sql: string) {
  let dropdownItems = [];
  conn.query(sql, function (err, rawDropdownOptions) {
    if (err) console.log(err);
    for (let item of rawDropdownOptions) {
      dropdownItems.push({ id: item.EntryID, name: item.Item });
    }
    getGenericRxNormIDs(dropdownItems).then(() => {
      stream.write('{}]');
      genericStream.write(`{}]`);
    });
  });
}

async function getGenericRxNormIDs(items: any[]) {
  items = getUniqueEntries(items);
  let output = [];
  stream.write(`[`);
  genericStream.write(`[`);
  for (let item of items) {
    rxNormStore.addGeneric(item);
    let url = cuiURI(item.name);
    output.push(
      fetch(url)
        .then((res) => res.json())
        .then((parsed) => {
          let parsedProp = parsed.idGroup;
          rxNormStore.addItemWithID(parsedProp['rxnormId'], parsedProp['name']);
          parsedProp.name = item['name'];
          parsedProp.id = item['id'];
          parsedProp['uri'] = brandURI(parsedProp['rxnormId']);
          genericStream.write(JSON.stringify(parsedProp) + ',');
          return parsedProp;
        })
        .then(getBrandsFromURL)
        .then((res) => {
          return res;
        })
    );
  }

  writeFileSync(itemsPath, JSON.stringify(await Promise.all(output)));
  return 0;
}

function getUniqueEntries(array) {
  return array.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj['name']).indexOf(obj['name']) === pos;
  });
}

let rxNormStore = {
  genericStore: [],
  withIDStore: new Map(),

  addGeneric(item) {
    this.genericStore.push(item);
  },
  addItemWithID(item, id) {
    this.withIDStore.set(item, id);
  },
  unmatchedItems() {
    let _unmatchedItems = [];
    for (let item of this.genericStore) {
      this.widthIDStore.has(item) ? null : _unmatchedItems.push(item);
    }
    return _unmatchedItems;
  },
};
