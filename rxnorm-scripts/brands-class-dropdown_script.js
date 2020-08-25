"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var cross_fetch_1 = require("cross-fetch");
var inFile = './class-dropdown-generic.json';
var brandURI = function (cui) {
    return "https://rxnav.nlm.nih.gov/REST/rxcui/" + cui + "/related.json?tty=bn";
};
var writeContent = [];
function importFileToObj(file) {
    return __awaiter(this, void 0, void 0, function () {
        var output;
        return __generator(this, function (_a) {
            fs_1.readFile(file, function (err, data) {
                if (err)
                    console.log(err);
                output = JSON.parse(data.toString());
                var i = 1;
                storeObjects(output)
                    .then(getGenericRxCUI)
                    .then(getBrandURLResponse)
                    .then(function (input) {
                    var len = input.length;
                    input.forEach(function (item) {
                        if (item.hasOwnProperty('relatedGroup')) {
                            item.relatedGroup.conceptGroup.forEach(function (el) {
                                if (el.hasOwnProperty('conceptProperties')) {
                                    el.conceptProperties.forEach(function (elem) {
                                        writeContent.push({
                                            name: elem.name,
                                            rxcui: elem.rxcui,
                                            id: item.relatedGroup.id,
                                            parentRxCUI: item.relatedGroup.parentRxCUI
                                        });
                                        if (i === len) {
                                            fs_1.writeFileSync('./brands-class-dropdown.json', JSON.stringify(writeContent));
                                        }
                                    });
                                }
                            });
                        }
                        i++;
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
function storeObjects(obj) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, obj];
        });
    });
}
function getGenericRxCUI(drugs) {
    return __awaiter(this, void 0, void 0, function () {
        var out, _i, drugs_1, drug, _a, _b, generic;
        return __generator(this, function (_c) {
            out = [];
            for (_i = 0, drugs_1 = drugs; _i < drugs_1.length; _i++) {
                drug = drugs_1[_i];
                for (_a = 0, _b = drug.brands; _a < _b.length; _a++) {
                    generic = _b[_a];
                    console.log(generic.name);
                    out.push({
                        rxcui: generic.rxcui,
                        name: generic.name,
                        id: drug.id,
                        uri: brandURI(generic.rxcui)
                    });
                }
            }
            fs_1.writeFileSync('./generic-class-dropdown.json', JSON.stringify(out));
            return [2 /*return*/, out];
        });
    });
}
function getBrandURLResponse(generics) {
    return __awaiter(this, void 0, void 0, function () {
        var output, _i, generics_1, generic, out, _loop_1, _a, out_1, ou;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    output = [];
                    for (_i = 0, generics_1 = generics; _i < generics_1.length; _i++) {
                        generic = generics_1[_i];
                        try {
                            output.push(cross_fetch_1.fetch(generic.uri)
                                .then(function (res) { return res.json(); })["catch"](function (err) { return console.log(err); }));
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    return [4 /*yield*/, Promise.all(output)];
                case 1:
                    out = _b.sent();
                    _loop_1 = function (ou) {
                        var geni = generics.filter(function (item) { return item.rxcui === ou.relatedGroup.rxcui; });
                        ou.relatedGroup['id'] = geni[0].id;
                        ou.relatedGroup['parentRxCUI'] = geni[0].rxcui;
                    };
                    for (_a = 0, out_1 = out; _a < out_1.length; _a++) {
                        ou = out_1[_a];
                        _loop_1(ou);
                    }
                    console.log(out);
                    return [2 /*return*/, out];
            }
        });
    });
}
importFileToObj(inFile);
