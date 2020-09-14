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
var inFile = './json-out/diuretics.json';
var outFile = './json-out/diuretics-generics-dropdown.json';
var outArray = [];
var antidepressives = [181];
function importFileToObj(file) {
    return __awaiter(this, void 0, void 0, function () {
        var output;
        var _this = this;
        return __generator(this, function (_a) {
            fs_1.readFile(file, function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                var _loop_1, _i, output_1, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                console.log(err);
                            output = JSON.parse(data.toString());
                            _loop_1 = function (item) {
                                var name_1, err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            name_1 = item.name;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, cross_fetch_1.fetch("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + name_1)
                                                    .then(function (res) { return res.json(); })
                                                    .then(function (res) {
                                                    for (var _i = 0, antidepressives_1 = antidepressives; _i < antidepressives_1.length; _i++) {
                                                        var id = antidepressives_1[_i];
                                                        outArray.push({
                                                            name: name_1,
                                                            rxcui: res.idGroup.rxnormId[0],
                                                            id: id
                                                        });
                                                    }
                                                    if (outArray.length / antidepressives.length === output.length) {
                                                        writeInfoOut(outArray, outFile);
                                                    }
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_1 = _a.sent();
                                            console.log(err_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            _i = 0, output_1 = output;
                            _a.label = 1;
                        case 1:
                            if (!(_i < output_1.length)) return [3 /*break*/, 4];
                            item = output_1[_i];
                            return [5 /*yield**/, _loop_1(item)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function writeInfoOut(array, file) {
    fs_1.writeFileSync(file, JSON.stringify(array));
}
importFileToObj(inFile);