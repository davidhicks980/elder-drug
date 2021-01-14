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
exports.Cols = exports.Category = exports.FirebaseService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ReplaySubject_1 = require("rxjs/internal/ReplaySubject");
var beers = require("../assets/beers-entries.json");
var FirebaseService = /** @class */ (function () {
    function FirebaseService(firestore, tableService) {
        var _this = this;
        this.firestore = firestore;
        this.tableService = tableService;
        this.updatedTables = new rxjs_1.Subject();
        this.queriedTables$ = this.updatedTables.asObservable();
        this.entryMap = new Map();
        this.tablesSource = new ReplaySubject_1.ReplaySubject();
        this.groupedTables$ = this.tablesSource.asObservable();
        this.activeTables = new rxjs_1.Subject();
        this.queryMap = new Map();
        this.dropdownItems = new Map();
        this.beersMap = new Map();
        this.beersObjects = beers["default"];
        this.filterDropdown = new rxjs_1.Subject();
        this.filteredItems$ = this.filterDropdown.asObservable();
        /** Emits table columns that contain any data */
        this.filteredFieldsSource = new ReplaySubject_1.ReplaySubject();
        /** Observable for columns containing data */
        this.filteredFields$ = this.filteredFieldsSource.asObservable();
        this.columnDefinitions = [
            {
                description: 'General Info',
                filters: [null],
                id: 1,
                columnOptions: [
                    { id: Cols.SearchTerm, selected: true },
                    { id: Cols.Item, selected: true },
                    { id: Cols.Excl, selected: false },
                    { id: Cols.Incl, selected: false },
                    { id: Cols.Recommendation, selected: true },
                    { id: Cols.DiseaseState, selected: true },
                    { id: Cols.DrugInter, selected: false },
                    { id: Cols.ShortName, selected: false },
                ]
            },
            {
                description: 'Disease-Specific',
                filters: [Cols.DiseaseState],
                id: 3,
                columnOptions: [
                    { id: Cols.SearchTerm, selected: true },
                    { id: Cols.Item, selected: true },
                    { id: Cols.Excl, selected: true },
                    { id: Cols.Incl, selected: true },
                    { id: Cols.Recommendation, selected: false },
                    { id: Cols.DiseaseState, selected: true },
                ]
            },
            {
                description: 'Renal Interactions',
                id: 6,
                filters: [Cols.MaxCl, Cols.MinCl],
                columnOptions: [
                    { id: Cols.SearchTerm, selected: true },
                    { id: Cols.Item, selected: true },
                    { id: Cols.MinCl, selected: true },
                    { id: Cols.MaxCl, selected: true },
                    { id: Cols.Incl, selected: false },
                    { id: Cols.Excl, selected: false },
                    { id: Cols.Recommendation, selected: true },
                ]
            },
            {
                description: 'Drug Interactions',
                filters: [Cols.DrugInter],
                id: 5,
                columnOptions: [
                    { id: Cols.SearchTerm, selected: true },
                    { id: Cols.Item, selected: true },
                    { id: Cols.DrugInter, selected: true },
                    { id: Cols.Incl, selected: true },
                    { id: Cols.Excl, selected: true },
                    { id: Cols.Recommendation, selected: true },
                    { id: Cols.Rationale, selected: false },
                ]
            },
        ];
        this.columnOptions = [
            { id: 1, field: 'EntryID', header: 'Entry Number' },
            { id: 2, field: 'DiseaseState', header: 'Disease State' },
            { id: 3, field: 'Category', header: 'Category Number' },
            { id: 4, field: 'TableDefinition', header: 'Table Definition' },
            { id: 5, field: 'Item', header: 'Item' },
            { id: 6, field: 'MinimumClearance', header: 'Min Clearance' },
            { id: 7, field: 'MaximumClearance', header: 'Max Clearance' },
            { id: 8, field: 'DrugInteraction', header: 'Drug Interaction' },
            { id: 9, field: 'Inclusion', header: 'Includes' },
            { id: 10, field: 'Exclusion', header: 'Excludes' },
            { id: 11, field: 'Rationale', header: 'Rationale' },
            { id: 12, field: 'Recommendation', header: 'Recommendation' },
            { id: 13, field: 'RecommendationLineTwo', header: 'LineTwo' },
            { id: 14, field: 'ItemType', header: 'Type' },
            { id: 15, field: 'ShortTableName', header: 'Table' },
            { id: 16, field: 'SearchTerm', header: 'Search Term' },
        ];
        this.getUniqueListBy = function (arr, key) {
            return __spreadArrays(new Map(arr.map(function (item) { return [item[key], item]; })).values());
        };
        this.queryBeersDropdown(firestore).then(function (res) {
            _this.createDropdownMap(res);
            _this.loaded = true;
        });
        this.beersObjects.forEach(function (item) { return _this.beersMap.set(item.EntryID, item); });
        this.activeTables.subscribe(function (tables) {
            return tableService.emitSelectedTables(tables);
        });
    }
    FirebaseService.prototype.getColFields = function (definitions, columnOptions) {
        var tableFields = new Map();
        var _loop_1 = function (def) {
            var displayIndices = def.columnOptions.map(function (item) { return item.id; });
            var selectIndices = def.columnOptions
                .filter(function (item) { return item.selected === true; })
                .map(function (item) { return item.id; });
            var displayedOptions = columnOptions.filter(function (item) {
                return displayIndices.includes(item.id);
            });
            var selectedOptions = columnOptions.filter(function (item) {
                return selectIndices.includes(item.id);
            });
            tableFields.set(def.id, {
                displayed: displayedOptions,
                selected: selectedOptions
            });
        };
        for (var _i = 0, definitions_1 = definitions; _i < definitions_1.length; _i++) {
            var def = definitions_1[_i];
            _loop_1(def);
        }
        return tableFields;
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
            var reference;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fire
                            .collection('dropdown')
                            .doc('dropdownItems')
                            .ref.get()];
                    case 1:
                        reference = _a.sent();
                        return [4 /*yield*/, reference.data()];
                    case 2: return [2 /*return*/, _a.sent()];
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
    FirebaseService.prototype.getTableNamesContainingData = function (tables) {
        var out = new Set();
        tables.forEach(function (table) {
            out.add(1);
            if ([
                Category.DiseaseGuidance,
                Category.DrugInteractions,
                Category.RenalEffect,
            ].includes(table.Category))
                out.add(table.Category);
        });
        return __spreadArrays(out);
    };
    FirebaseService.prototype.emitTables = function (tableList) {
        var _this = this;
        var categories = [
            Category.DiseaseGuidance,
            Category.RenalEffect,
            Category.DrugInteractions,
            Category.General,
        ];
        var mappedTerms = this.getUniqueListBy(this.mapQueryTerms(tableList), 'EntryID');
        var createTableObjects = function (mappedTerms, categories, definitions, columns) {
            var tables = [];
            var _loop_2 = function (category) {
                //If the table category is general, use all tables
                var generalInfo = category === Category.General;
                var table = generalInfo
                    ? mappedTerms
                    : mappedTerms.filter(function (item) { return item.Category == category; });
                //Check to see if tables exist and contain items
                if (table) {
                    if (table.length > 0) {
                        //Get the columns that are relevant to the displayed table
                        var fields = _this.getColFields(_this.columnDefinitions, _this.columnOptions).get(category);
                        var selected = fields.selected, displayed_1 = fields.displayed;
                        var displayedColumns = Array.from(table.reduce(function (acc, curr) {
                            // Iterate through each entry in a specific drug table
                            for (var key in curr) {
                                var displayedFields = displayed_1.map(function (item) { return item.field; });
                                if (key === 'SearchTerm') {
                                    acc.add(key);
                                }
                                else if (curr[key] && displayedFields.includes(key)) {
                                    acc.add(key);
                                }
                            }
                            return acc;
                        }, new Set()));
                        tables.push({
                            id: category,
                            tables: table,
                            fields: displayedColumns,
                            selected: __spreadArrays(selected.map(function (item) { return item.field; }))
                        });
                    }
                }
            };
            for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                var category = categories_1[_i];
                _loop_2(category);
            }
            return tables;
        };
        this.activeTables.next(this.getTableNamesContainingData(mappedTerms));
        var tables = createTableObjects(mappedTerms, categories, this.columnDefinitions, this.columnOptions);
        for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
            var table = tables_1[_i];
            this.filteredFieldsSource.next(table);
            this.tablesSource.next(table);
        }
    };
    FirebaseService.prototype.mapQueryTerms = function (tables) {
        for (var _i = 0, tables_2 = tables; _i < tables_2.length; _i++) {
            var table = tables_2[_i];
            table['SearchTerm'] = this.queryMap.get(table['EntryID']).join(' | ');
        }
        return tables;
    };
    FirebaseService.prototype.filterValues = function (entry) {
        if (entry) {
            var first = entry[0].toLowerCase();
            this.filterDropdown.next(this.dropdownItems
                .get(first)
                .filter(function (val) { return val.startsWith(entry.toLowerCase()); })
                .slice(0, 10)
                .map(function (item) { return [entry, item.substr(entry.length, Infinity)]; }));
        }
    };
    FirebaseService.prototype.createDropdownMap = function (list) {
        var dropdown = [];
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
var Category;
(function (Category) {
    Category[Category["General"] = 1] = "General";
    Category[Category["PotentiallyInnappropriate"] = 2] = "PotentiallyInnappropriate";
    Category[Category["DiseaseGuidance"] = 3] = "DiseaseGuidance";
    Category[Category["Caution"] = 4] = "Caution";
    Category[Category["DrugInteractions"] = 5] = "DrugInteractions";
    Category[Category["RenalEffect"] = 6] = "RenalEffect";
    Category[Category["Anticholinergics"] = 7] = "Anticholinergics";
})(Category = exports.Category || (exports.Category = {}));
var Cols;
(function (Cols) {
    Cols[Cols["EntryID"] = 1] = "EntryID";
    Cols[Cols["DiseaseState"] = 2] = "DiseaseState";
    Cols[Cols["Category"] = 3] = "Category";
    Cols[Cols["TableDefinition"] = 4] = "TableDefinition";
    Cols[Cols["Item"] = 5] = "Item";
    Cols[Cols["MinCl"] = 6] = "MinCl";
    Cols[Cols["MaxCl"] = 7] = "MaxCl";
    Cols[Cols["DrugInter"] = 8] = "DrugInter";
    Cols[Cols["Incl"] = 9] = "Incl";
    Cols[Cols["Excl"] = 10] = "Excl";
    Cols[Cols["Rationale"] = 11] = "Rationale";
    Cols[Cols["Recommendation"] = 12] = "Recommendation";
    Cols[Cols["RecommendationLineTwo"] = 13] = "RecommendationLineTwo";
    Cols[Cols["ItemType"] = 14] = "ItemType";
    Cols[Cols["ShortName"] = 15] = "ShortName";
    Cols[Cols["SearchTerm"] = 16] = "SearchTerm";
})(Cols = exports.Cols || (exports.Cols = {}));
