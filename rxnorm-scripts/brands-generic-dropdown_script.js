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
var mysql = require('mysql');
var dropdownPath = 'brands-generic-dropdown.json';
var itemsPath = 'drug-items.json';
var genericsDropdownPath = 'generics-dropdown.json';
//clear dropdown file
fs_1.writeFileSync(dropdownPath, '');
//clear generics file
fs_1.writeFileSync(genericsDropdownPath, '');
var genericStream = fs_1.createWriteStream(genericsDropdownPath);
var stream = fs_1.createWriteStream(dropdownPath);
var conn = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'davicks',
    password: 'burrito7',
    database: 'geridb'
});
conn.connect(function (err) {
    if (err)
        console.log(err);
    var sql = "select EntryID, Item from all_guidance ag where ItemType = \"drug\"  ";
    queryGenericIDs(sql);
});
var brandURI = function (cui) {
    return "https://rxnav.nlm.nih.gov/REST/rxcui/" + cui + "/related.json?tty=bn";
};
var cuiURI = function (name) {
    return "https://rxnav.nlm.nih.gov/REST/rxcui.json?name=" + name;
};
function getBrandsFromURL(obj) {
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = obj['uri'];
                    obj.brands = [];
                    return [4 /*yield*/, cross_fetch_1.fetch(url)
                            .then(function (res) { return res.json(); })
                            .then(function (parsed) {
                            for (var key in parsed) {
                                if (parsed.hasOwnProperty(key)) {
                                    var element = parsed[key];
                                    for (var _i = 0, _a = element.conceptGroup; _i < _a.length; _i++) {
                                        var ele = _a[_i];
                                        if (ele.hasOwnProperty('conceptProperties')) {
                                            var el = ele['conceptProperties'];
                                            for (var _b = 0, el_1 = el; _b < el_1.length; _b++) {
                                                var l = el_1[_b];
                                                obj.brands.push({
                                                    name: l.name,
                                                    rxcui: l.rxcui
                                                });
                                                var brandChunk = {
                                                    name: l.name,
                                                    rxcui: l.rxcui,
                                                    id: obj.id,
                                                    parentRxNormId: obj.rxnormId
                                                };
                                                stream.write(JSON.stringify(brandChunk) + ",");
                                            }
                                        }
                                    }
                                }
                            }
                            return obj;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function queryGenericIDs(sql) {
    var dropdownItems = [];
    conn.query(sql, function (err, rawDropdownOptions) {
        if (err)
            console.log(err);
        for (var _i = 0, rawDropdownOptions_1 = rawDropdownOptions; _i < rawDropdownOptions_1.length; _i++) {
            var item = rawDropdownOptions_1[_i];
            dropdownItems.push({ id: item.EntryID, name: item.Item });
        }
        getGenericRxNormIDs(dropdownItems).then(function () {
            stream.write('{}]');
            genericStream.write("{}]");
        });
    });
}
function getGenericRxNormIDs(items) {
    return __awaiter(this, void 0, void 0, function () {
        var output, _loop_1, _i, items_1, item, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    items = getUniqueEntries(items);
                    output = [];
                    stream.write("[");
                    genericStream.write("[");
                    _loop_1 = function (item) {
                        rxNormStore.addGeneric(item);
                        var url = cuiURI(item.name);
                        output.push(cross_fetch_1.fetch(url)
                            .then(function (res) { return res.json(); })
                            .then(function (parsed) {
                            var parsedProp = parsed.idGroup;
                            rxNormStore.addItemWithID(parsedProp['rxnormId'], parsedProp['name']);
                            parsedProp.name = item['name'];
                            parsedProp.id = item['id'];
                            parsedProp['uri'] = brandURI(parsedProp['rxnormId']);
                            genericStream.write(JSON.stringify(parsedProp) + ',');
                            return parsedProp;
                        })
                            .then(getBrandsFromURL)
                            .then(function (res) {
                            return res;
                        }));
                    };
                    for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                        item = items_1[_i];
                        _loop_1(item);
                    }
                    _a = fs_1.writeFileSync;
                    _b = [itemsPath];
                    _d = (_c = JSON).stringify;
                    return [4 /*yield*/, Promise.all(output)];
                case 1:
                    _a.apply(void 0, _b.concat([_d.apply(_c, [_e.sent()])]));
                    return [2 /*return*/, 0];
            }
        });
    });
}
function getUniqueEntries(array) {
    return array.filter(function (obj, pos, arr) {
        return arr.map(function (mapObj) { return mapObj['name']; }).indexOf(obj['name']) === pos;
    });
}
var rxNormStore = {
    genericStore: [],
    withIDStore: new Map(),
    addGeneric: function (item) {
        this.genericStore.push(item);
    },
    addItemWithID: function (item, id) {
        this.withIDStore.set(item, id);
    },
    unmatchedItems: function () {
        var _unmatchedItems = [];
        for (var _i = 0, _a = this.genericStore; _i < _a.length; _i++) {
            var item = _a[_i];
            this.widthIDStore.has(item) ? null : _unmatchedItems.push(item);
        }
        return _unmatchedItems;
    }
};
