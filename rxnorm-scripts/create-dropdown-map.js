"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var fs_1 = require("fs");
var dropdownStream = fs_1.createWriteStream('./dropdown-map.json');
var dropdownPaths = ['all-dropdown-items.json'];
fs_1.writeFileSync('./dropdown-map.json', '');
var outMap = {};
function combineFiles(paths, out) {
    var e_1, _a;
    try {
        for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
            var path = paths_1_1.value;
            fs_1.readFile(path, function (err, data) {
                var e_2, _a, e_3, _b, e_4, _c;
                var parsedData = JSON.parse(data.toString());
                try {
                    for (var parsedData_1 = (e_2 = void 0, __values(parsedData)), parsedData_1_1 = parsedData_1.next(); !parsedData_1_1.done; parsedData_1_1 = parsedData_1.next()) {
                        var item = parsedData_1_1.value;
                        item.name = ("" + item.name).toLowerCase();
                        item.name = item.name.replace(/\s+/g, ' ');
                        outMap["" + item.name] = [];
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (parsedData_1_1 && !parsedData_1_1.done && (_a = parsedData_1["return"])) _a.call(parsedData_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                try {
                    for (var parsedData_2 = (e_3 = void 0, __values(parsedData)), parsedData_2_1 = parsedData_2.next(); !parsedData_2_1.done; parsedData_2_1 = parsedData_2.next()) {
                        var item = parsedData_2_1.value;
                        outMap["" + item.name].push(item.id);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (parsedData_2_1 && !parsedData_2_1.done && (_b = parsedData_2["return"])) _b.call(parsedData_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                try {
                    for (var parsedData_3 = (e_4 = void 0, __values(parsedData)), parsedData_3_1 = parsedData_3.next(); !parsedData_3_1.done; parsedData_3_1 = parsedData_3.next()) {
                        var item = parsedData_3_1.value;
                        var array = outMap["" + item.name];
                        outMap["" + item.name] = __spread(new Set(array));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (parsedData_3_1 && !parsedData_3_1.done && (_c = parsedData_3["return"])) _c.call(parsedData_3);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                fs_1.writeFileSync('./dropdown-map.json', JSON.stringify(outMap));
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (paths_1_1 && !paths_1_1.done && (_a = paths_1["return"])) _a.call(paths_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
combineFiles(dropdownPaths, dropdownStream);
