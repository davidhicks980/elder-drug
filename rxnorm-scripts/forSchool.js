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
fs_1.readFile('./all-generics-items.json', function (err, data) {
    var parsedData = JSON.parse(data.toString());
    for (var _i = 0, parsedData_1 = parsedData; _i < parsedData_1.length; _i++) {
        var item = parsedData_1[_i];
        getDosePacks(item.url, item);
    }
});
var stream = fs_1.createWriteStream('./ndcs-all-beers.json');
stream.write('[');
function getDosePacks(url, itemName) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cross_fetch_1.fetch(url)
                        .then(function (res) { return res.json(); })
                        .then(function (res) {
                        var outArray = [];
                        var out = res.drugGroup.conceptGroup.filter(function (item) {
                            if (item.tty === 'SBD' || item.tty === 'SCD') {
                                return item;
                            }
                        });
                        for (var _i = 0, out_1 = out; _i < out_1.length; _i++) {
                            var item = out_1[_i];
                            for (var _a = 0, _b = item.conceptProperties; _a < _b.length; _a++) {
                                var drug = _b[_a];
                                if (drug.rxcui) {
                                    outArray.push(drug.rxcui);
                                }
                            }
                        }
                        return outArray;
                    })
                        .then(function (urlStem) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, urlStem_1, item;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _i = 0, urlStem_1 = urlStem;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < urlStem_1.length)) return [3 /*break*/, 4];
                                    item = urlStem_1[_i];
                                    return [4 /*yield*/, cross_fetch_1.fetch("https://rxnav.nlm.nih.gov/REST/rxcui/" + item + "/ndcs.json")
                                            .then(function (res) { return res.json(); })
                                            .then(function (input) {
                                            var out = [];
                                            for (var _i = 0, _a = input.ndcGroup.ndcList.ndc; _i < _a.length; _i++) {
                                                var ndc = _a[_i];
                                                out.push(ndc);
                                                itemName.ndc = ndc;
                                                stream.write(JSON.stringify({ name: itemName.name, ndc: itemName.ndc, id: itemName.id }) + ",");
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function (err) { return null; })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
