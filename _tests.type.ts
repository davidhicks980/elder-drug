let data = [
  {
    category: 'Printer',
    manDate: '02/01/2019',
    day: 'Monday',

    amount: 90,
  },
  {
    category: 'Printer',
    manDate: '02/01/2019',
    amount: 100,
    day: 'Monday',
  },
  {
    category: 'Scanner',
    manDate: '02/03/2019',
    amount: 90,
    day: 'Monday',
  },
  {
    category: 'Printer',
    manDate: '02/04/2019',
    amount: 90,
    day: 'Tuesday',
  },
  {
    category: 'Scanner',
    manDate: '08/21/2019',
    amount: 8,
    day: 'Monday',
  },
  {
    category: 'Scanner',
    manDate: '08/21/2019',
    amount: 25,
    day: 'Monday',
  },
  {
    category: 'Scanner',
    manDate: '08/21/2019',
    amount: 25,
    day: 'Tuesday',
  },
  {
    category: 'Scanner',
    manDate: '08/21/2019',
    amount: 10,
    day: 'Tuesday',
  },
];

let headers = ['category', 'amount', 'day'];

////////////////////////////////
interface Entries {
  (value: number, rows: Entries[]): boolean;
}
let outMap = new Map();
let i = 0;
function groupBy(arr: any[], fields: string[]): any[] {
  let field = fields[0]; // one field at a time
  if (!field) return arr;
  let retArr = Object.values(
    arr.reduce((obj, current) => {
      if (!obj[current[field]])
        obj[current[field]] = { value: current[field], rows: [] };
      obj[current[field]].rows.push(current);
      return obj;
    }, {})
  );

  // recurse for each child's rows if there are remaining fields
  if (fields.length) {
    retArr.forEach((obj: any) => {
      obj.count = obj.rows.length;
      obj.rows = groupBy(obj.rows, fields.slice(1));
    });
  }
  return retArr;
}
groupBy(data, headers);

function flattenArrayRows(nested: any[], top = [], index = 0) {
  index++;
  for (let item of nested) {
    let hasChild = item?.rows?.length > 0;
    if (item && Array.isArray(item.rows) && hasChild) {
      appendSubHeader(top, item, index);
    } else {
      appendRow(top, item, index);
    }
  }
  return top;
}

let out = groupBy(data, headers);
let finished = flattenArrayRows(out);
console.log(finished);
function appendRow(top: any[], item: any, index: number) {
  top.push({ ...item, index, isGroup: false });
}

function appendSubHeader(top: any[], item: any, index: number) {
  top.push({ value: item.value, index, isGroup: true });
  flattenArrayRows(item.rows, top, index);
}
