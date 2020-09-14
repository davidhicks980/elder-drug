"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fs_1 = require("fs");
var out = fs_1.createWriteStream('./all-generics-items.json');
var dropdownPaths = [
    './json-out/generic-class-dropdown.json',
    './json-out/generics-dropdown.json',
    './json-out/antipsychotics-generics-dropdown.json',
    './json-out/anticholinergic-generics-dropdown.json',
    './json-out/diuretics-generics-dropdown.json',
    './json-out/antispasmodics-generics-dropdown.json',
    './json-out/antidepressives-generics-dropdown.json',
];
fs_1.writeFileSync('./all-generics-items.json', '');
function combineFiles(paths, out) {
    var outData = [];
    var i = 0;
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var path = paths_1[_i];
        fs_1.readFile(path, function (err, data) {
            var parsedData = JSON.parse(data.toString());
            for (var _i = 0, parsedData_1 = parsedData; _i < parsedData_1.length; _i++) {
                var item = parsedData_1[_i];
                var rxcui = item.rxnormId ? item.rxnormId[0] : item.rxcui;
                outData.push({
                    id: item.id,
                    name: item.name,
                    url: "https://rxnav.nlm.nih.gov/REST/rxcui/" + rxcui + "/related.json?tty=bn"
                });
                console.log(rxcui);
            }
            i++;
            if (i === paths.length) {
                out.write(JSON.stringify(__spreadArrays(outData)));
            }
        });
    }
}
combineFiles(dropdownPaths, out);
