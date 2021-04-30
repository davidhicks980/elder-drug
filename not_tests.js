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
let out = headerGroups[i].map((headers) => iterateDataValues(i, headers));

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
