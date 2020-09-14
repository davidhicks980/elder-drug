import { createWriteStream, writeFileSync, readFileSync, readFile } from 'fs';
import { fetch } from 'cross-fetch';

readFile('./all-generics-items.json', (err, data) => {
  let parsedData = JSON.parse(data.toString());
  for (let item of parsedData) {
    getDosePacks(item.url, item);
  }
});
let stream = createWriteStream('./ndcs-all-beers.json');
stream.write('[');
async function getDosePacks(url, itemName) {
  await fetch(url)
    .then((res) => res.json())
    .then((res) => {
      let outArray = [];
      let out = res.drugGroup.conceptGroup.filter((item) => {
        if (item.tty === 'SBD' || item.tty === 'SCD') {
          return item;
        }
      });
      for (let item of out) {
        for (let drug of item.conceptProperties) {
          if (drug.rxcui) {
            outArray.push(drug.rxcui);
          }
        }
      }
      return outArray;
    })
    .then(async (urlStem) => {
      for (let item of urlStem) {
        await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${item}/ndcs.json`)
          .then((res) => res.json())
          .then((input) => {
            let out = [];
            for (let ndc of input.ndcGroup.ndcList.ndc) {
              out.push(ndc);
              itemName.ndc = ndc;
              stream.write(`${JSON.stringify({name:itemName.name, ndc:itemName.ndc, id:itemName.id})},`);
            }
          });
      }
    })
    .catch((err) => null);
}
