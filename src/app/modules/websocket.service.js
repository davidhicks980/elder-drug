"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.FirebaseService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var beers = require("../assets/beers-entries.json");
var FirebaseService = /** @class */ (function () {
    function FirebaseService(firestore) {
        var _this = this;
        this.firestore = firestore;
        this.updatedTables = new rxjs_1.Subject();
        this.queriedTables$ = this.updatedTables.asObservable();
        this.entryMap = new Map();
        this.groupedTables = new rxjs_1.Subject();
        this.queryMap = new Map();
        this.dropdownItems = new Map();
        this.beersMap = new Map();
        this.beersObjects = beers["default"];
        this.getUniqueListBy = function (arr, key) {
            return __spreadArrays(new Map(arr.map(function (item) { return [item[key], item]; })).values());
        };
        this.queryBeersDropdown(firestore).then(function (res) {
            _this.loaded = res;
        });
        this.makeBeersMap();
    }
    FirebaseService.prototype.makeBeersMap = function () {
        var _this = this;
        this.beersObjects.forEach(function (item) { return _this.beersMap.set(item.EntryID, item); });
    };
    FirebaseService.prototype.queryBeers = function (drugs) {
        var compiledArray = [];
        for (var _i = 0, drugs_1 = drugs; _i < drugs_1.length; _i++) {
            var drug = drugs_1[_i];
            compiledArray.push(this.beersMap.get(drug));
        }
        return compiledArray;
    };
    FirebaseService.prototype.queryBeersDropdown = function (fire) {
        return __awaiter(this, void 0, void 0, function () {
            var reference, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fire
                            .collection('dropdown')
                            .doc('dropdownItems')
                            .ref.get()];
                    case 1:
                        reference = _b.sent();
                        _a = this.createDropdownMap;
                        return [4 /*yield*/, reference.data()];
                    case 2:
                        _a.apply(this, [_b.sent()]);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    FirebaseService.prototype.searchDrugs = function (drugs) {
        var indexArray = [];
        for (var _i = 0, drugs_2 = drugs; _i < drugs_2.length; _i++) {
            var drug = drugs_2[_i];
            var indices = this.entryMap.get(drug);
            indexArray.push.apply(indexArray, indices);
            for (var _a = 0, indices_1 = indices; _a < indices_1.length; _a++) {
                var index = indices_1[_a];
                this.getSearches(index, drug);
            }
        }
        this.emitTables(this.queryBeers(indexArray));
    };
    FirebaseService.prototype.getSearches = function (entryID, drug) {
        if (this.queryMap.has(entryID)) {
            var mappedDrugs = this.queryMap.get(entryID);
            if (!mappedDrugs.includes(drug)) {
                mappedDrugs.push(drug);
                this.queryMap.set(entryID, mappedDrugs);
            }
        }
        else {
            this.queryMap.set(entryID, [drug]);
        }
    };
    FirebaseService.prototype.emitTables = function (tables) {
        var mappedTerms = this.getUniqueListBy(this.mapQueryTerms(tables), 'EntryID');
        var groupedTables = this.groupTables(mappedTerms);
        this.groupedTables.next(groupedTables);
    };
    FirebaseService.prototype.mapQueryTerms = function (tables) {
        for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
            var table = tables_1[_i];
            table['SearchTerm'] = this.queryMap.get(table['EntryID']).join(' | ');
        }
        return tables;
    };
    FirebaseService.prototype.groupTables = function (tables) {
        var diseaseGuidanceTable = tables.filter(function (item) { return item.Category == 3; });
        var drugInteractionTable = tables.filter(function (item) { return item.Category == 5; });
        var clearanceTable = tables.filter(function (item) { return item.Category == 6; });
        var output = {
            Clearance: clearanceTable,
            DrugInteraction: drugInteractionTable,
            DiseaseGuidance: diseaseGuidanceTable,
            GeneralInfo: tables
        };
        return output;
    };
    FirebaseService.prototype.filterValues = function (entry) {
        if (entry.length) {
            var first = entry[0].toLowerCase();
            return this.dropdownItems
                .get(first)
                .filter(function (val) { return val.startsWith(entry.toLowerCase()); });
        }
    };
    FirebaseService.prototype.createDropdownMap = function (list) {
        var dropdown = [];
        var indexedObj = new Map();
        var key = '';
        var i = 0;
        var letter;
        for (var item in list) {
            key = item.replace(/\+/gi, ' ').toLowerCase();
            dropdown.push(key);
            this.entryMap.set(key, list[item]);
        }
        //Map each letter to respective drug names;
        for (i = 0; i < 26; i++) {
            letter = (i + 10).toString(36);
            this.dropdownItems.set(letter, dropdown.filter(function (name) { return name.startsWith(letter); }));
        }
    };
    FirebaseService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FirebaseService);
    return FirebaseService;
}());
exports.FirebaseService = FirebaseService;
