let data = [
  {
    category: "Printer",
    manDate: "02/01/2019",
    amount: 90,
  },
  {
    category: "Printer",
    manDate: "02/01/2019",
    amount: 100,
  },
  {
    category: "Scanner",
    manDate: "02/03/2019",
    amount: 90,
  },
  {
    category: "Printer",
    manDate: "02/04/2019",
    amount: 90,
  },
  {
    category: "Scanner",
    manDate: "08/21/2019",
    amount: 8,
  },
  {
    category: "Scanner",
    manDate: "08/21/2019",
    amount: 25,
  },
  {
    category: "Scanner",
    manDate: "08/21/2019",
    amount: 25,
  },
  {
    category: "Scanner",
    manDate: "08/21/2019",
    amount: 10,
  },
];

let groups = ["category", "amount"];
let headerGroups = getGrouped(data, groups);
let i = 0;
let length = headerGroups.length;

function filledGroups(groupI) {}
function numberToArray(N) {
  let arr = Array(N),
    index = 0;
  while (b < N) arr[index++] = index;
  return a;
}
////////////////////////////////
function iterateDataValues(i, prevHeaders) {
  if (i === length - 1) {
    headerGroups[i].map(() => {
      let values = [];
      for (let j = 0; j < i; j++) {
        data.filter(filledGroups(i, j, groups, val));
      }
      data.filter(
        (val, index) =>
          val[groups[i * index + 1]] === header[i * index + 1] &&
          val[groups[i++]] === header[i++]
      );
      let layer = [];

      if (values && Array.isArray(values) && values.length > 0) {
        for (let n = 0; n < i; n++)
          layer[n] = { isGroup: true, name: groups[n], expanded: false };

        return [...layer, ...values];
      } else return false;
    });
  } else if (i < length - 1) {
    return headerGroups[i++].map((i, nextHeaders) =>
      iterateDataValues(i++, [prevHeaders.flat(1), nextHeaders])
    );
  }
}

//'[[headVal, headVal], [headVal, headVal]]'
//let out = headerGroups[i].map((headers) => iterateDataValues(i, headers));

/*
let output = grouped[0].map((header1) =>
  grouped[1].map((header2) => {
    let head[i]
    let values = test.filter(
      (val) => val[headers[0]] === header1 && val[headers[1]] === header2
    );
    let layer = [];

    if (values && Array.isArray(values) && values.length > 0) {
      layer[0] = { isGroup: true, name: header, expanded: false };
      layer[1] = { isGroup: true, name: innerHeader, expanded: false };
      return [...layer, ...values];
    } else return false;
  })
);*/

function getGrouped(data, headers) {
  return headers.map((header) =>
    Array.from(new Set(data.map((val) => val[header])))
  );
}

let list = {
  value: [33, 2, 1, 5, 6, 2, 1, 5, 7, 8, 8, 8, 9, 5, 4, 33, 1, 5, 6, 7],
};
/*function moveItemInList(fromIndex, toIndex) {
  let array = [5, 10, 55, 20, 30];
  array.splice(toIndex, 0, list.value[fromIndex]);
  console.log(array);
}

moveItemInList(19, 1);
*/
/*
const getPosition = ({ rootIndex = 0, layer = 0 }, index = 0) => {
  layer++;
  return { rootIndex, layer, index };
};

let parent = { layer: 5 };

let position = getPosition(parent, 2);
console.log(parent, position);
*/
