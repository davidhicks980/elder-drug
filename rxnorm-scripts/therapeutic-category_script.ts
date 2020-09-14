import { readFile, writeFileSync } from 'fs';
import { fetch } from 'cross-fetch';
let inFile = './class-dropdown-generic.json';
const brandURI = (cui: string): string =>
  `https://rxnav.nlm.nih.gov/REST/rxclass/classMembers?classId=${cui}&relaSource=FMTSME&rela=has_TC`;

let writeContent = [];
export interface Drug {
  id: number;
  url: string;
  brands: { rxcui: string; name: string }[];
  classId: string;
}
export interface Generic {
  rxcui: string;
  generic: string;
  id: number;
  uri: string;
}
async function importFileToObj(file: string) {
  let output;

  readFile(file, (err, data) => {
    if (err) console.log(err);
    output = JSON.parse(data.toString());
    let i = 1;
    storeObjects(output)
      .then(getGenericRxCUI)
      .then(getBrandURLResponse)
      .then((input) => {
        let len = input.length;
        input.forEach((item) => {
          if (item.hasOwnProperty('relatedGroup')) {
            item.relatedGroup.conceptGroup.forEach((el) => {
              if (el.hasOwnProperty('conceptProperties')) {
                el.conceptProperties.forEach((elem) => {
                  writeContent.push({
                    name: elem.name,
                    rxcui: elem.rxcui,
                    id: item.relatedGroup.id,
                    parentRxCUI: item.relatedGroup.parentRxCUI,
                  });
                  if (i === len) {
                    writeFileSync(
                      './brands-class-dropdown.json',
                      JSON.stringify(writeContent)
                    );
                  }
                });
              }
            });
          }
          i++;
        });
      });
  });
}
async function storeObjects(obj: Drug[]) {
  return obj;
}
async function getGenericRxCUI(drugs: Drug[]) {
  let out = [];
  for (const drug of drugs) {
    for (const generic of drug.brands) {
      console.log(generic.name);
      out.push({
        rxcui: generic.rxcui,
        name: generic.name,
        id: drug.id,
        uri: brandURI(generic.rxcui),
      });
    }
  }

  writeFileSync('./generic-class-dropdown.json', JSON.stringify(out));
  return out;
}

async function getBrandURLResponse(generics: Generic[]) {
  let output = [];
  for (let generic of generics) {
    try {
      output.push(
        fetch(generic.uri)
          .then((res) => res.json())
          .catch((err) => console.log(err))
      );
    } catch (err) {
      console.log(err);
    }
  }
  let out = await Promise.all(output);

  for (let ou of out) {
    let geni = generics.filter((item) => item.rxcui === ou.relatedGroup.rxcui);
    ou.relatedGroup['id'] = geni[0].id;
    ou.relatedGroup['parentRxCUI'] = geni[0].rxcui;
  }
  return out;
}

importFileToObj(inFile);
