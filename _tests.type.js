var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var data = [
    {
        category: 'Printer',
        manDate: '02/01/2019',
        day: 'Monday',
        amount: 90
    },
    {
        category: 'Printer',
        manDate: '02/01/2019',
        amount: 100,
        day: 'Monday'
    },
    {
        category: 'Scanner',
        manDate: '02/03/2019',
        amount: 90,
        day: 'Monday'
    },
    {
        category: 'Printer',
        manDate: '02/04/2019',
        amount: 90,
        day: 'Tuesday'
    },
    {
        category: 'Scanner',
        manDate: '08/21/2019',
        amount: 8,
        day: 'Monday'
    },
    {
        category: 'Scanner',
        manDate: '08/21/2019',
        amount: 25,
        day: 'Monday'
    },
    {
        category: 'Scanner',
        manDate: '08/21/2019',
        amount: 25,
        day: 'Tuesday'
    },
    {
        category: 'Scanner',
        manDate: '08/21/2019',
        amount: 10,
        day: 'Tuesday'
    },
];
var headers = ['category', 'amount', 'day'];
var outMap = new Map();
var i = 0;
function groupBy(arr, fields) {
    var field = fields[0]; // one field at a time
    if (!field)
        return arr;
    var retArr = Object.values(arr.reduce(function (obj, current) {
        if (!obj[current[field]])
            obj[current[field]] = { value: current[field], rows: [] };
        obj[current[field]].rows.push(current);
        return obj;
    }, {}));
    // recurse for each child's rows if there are remaining fields
    if (fields.length) {
        retArr.forEach(function (obj) {
            obj.count = obj.rows.length;
            obj.rows = groupBy(obj.rows, fields.slice(1));
        });
    }
    return retArr;
}
groupBy(data, headers);
function flattenArrayRows(nested, top, index) {
    var _a;
    if (top === void 0) { top = []; }
    if (index === void 0) { index = 0; }
    index++;
    for (var _i = 0, nested_1 = nested; _i < nested_1.length; _i++) {
        var item = nested_1[_i];
        var hasChild = ((_a = item === null || item === void 0 ? void 0 : item.rows) === null || _a === void 0 ? void 0 : _a.length) > 0;
        if (item && Array.isArray(item.rows) && hasChild) {
            appendSubHeader(top, item, index);
        }
        else {
            appendRow(top, item, index);
        }
    }
    return top;
}
var out = groupBy(data, headers);
var finished = flattenArrayRows(out);
console.log(finished);
function appendRow(top, item, index) {
    top.push(__assign(__assign({}, item), { index: index, isGroup: false }));
}
function appendSubHeader(top, item, index) {
    top.push({ value: item.value, index: index, isGroup: true });
    flattenArrayRows(item.rows, top, index);
}
