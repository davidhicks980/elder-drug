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
var columns_service_1 = require("./columns.service");
/* eslint-disable @typescript-eslint/member-ordering */
var FirebaseService = /** @class */ (function () {
    function FirebaseService(firestore, tableService) {
        var _this = this;
        this.firestore = firestore;
        this.tableService = tableService;
        this.updatedTables = new rxjs_1.Subject();
        this.queriedTables$ = this.updatedTables.asObservable();
        this.entryMap = new Map();
        this.activeTables = new rxjs_1.Subject();
        this.queryMap = new Map();
        this.dropdownItems = new Map();
        this.beersMap = new Map();
        this.beersObjects = beers["default"];
        this.filterDropdown = new rxjs_1.Subject();
        this.filteredItems$ = this.filterDropdown.asObservable();
        /** Emits table columns that contain any data */
        this.filteredFieldsSource = new rxjs_1.ReplaySubject(1);
        /** Observable for columns containing data */
        this.filteredFields$ = this.filteredFieldsSource.asObservable();
        this.tableData = new Map();
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
    /* private getColFields(
      definitions: columnDefinition[],
      columnOptions: Column[]
    ): Map<number, { displayed: Column[]; selected: Column[] }> {
      let tableFields = new Map() as Map<
        number,
        { displayed: Column[]; selected: Column[] }
      >;
      for (let def of definitions) {
        let displayIndices = def.columnOptions.map((item) => item.id);
        let selectIndices = def.columnOptions
          .filter((item) => item.selected === true)
          .map((item) => item.id);
        const displayedOptions = columnOptions.filter((item) =>
          displayIndices.includes(item.field)
        );
        const selectedOptions = columnOptions.filter((item: ColumnDefinition) =>
          selectIndices.includes(item.field)
        );
        tableFields.set(def.id, {
          displayed: displayedOptions,
          selected: selectedOptions,
        });
      }
      return tableFields;
    }*/
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
                columns_service_1.Category.DiseaseGuidance,
                columns_service_1.Category.DrugInteractions,
                columns_service_1.Category.RenalEffect,
            ].includes(table.Category)) {
                out.add(table.Category);
            }
        });
        return __spreadArrays(out);
    };
    FirebaseService.prototype.emitTables = function (tableList) {
        var mappedTerms = this.getUniqueListBy(this.mapQueryTerms(tableList), 'EntryID');
        var columnsWithData = [];
        var dataMappedToColumns = [];
        var tablesWithData = [];
        var i = 0;
        var item;
        for (item in mappedTerms[0]) {
            dataMappedToColumns[item] = mappedTerms.map(function (table) { return table[item]; });
            if (dataMappedToColumns[item].length > 0) {
                columnsWithData.push(item);
                switch (item) {
                    case columns_service_1.ColumnField.DiseaseState:
                        {
                            tablesWithData.push(columns_service_1.Category.DiseaseGuidance);
                        }
                        break;
                    case columns_service_1.ColumnField.DrugInteraction:
                        {
                            tablesWithData.push(columns_service_1.Category.DrugInteractions);
                        }
                        break;
                    case columns_service_1.ColumnField.MinimumClearance || columns_service_1.ColumnField.MaximumClearance:
                        {
                            tablesWithData.push(columns_service_1.Category.RenalEffect);
                        }
                        break;
                }
            }
        }
        this.tableService.emitSelectedTables(tablesWithData);
        this.filteredFieldsSource.next(columnsWithData);
        !this.tableSource
            ? (this.tableSource = new rxjs_1.BehaviorSubject(mappedTerms))
            : this.tableSource.next(mappedTerms);
        this.tableData.set(Date.now(), mappedTerms);
    };
    FirebaseService.prototype.mapQueryTerms = function (tables) {
        console.log(tables);
        for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
            var table = tables_1[_i];
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
/*let createTableObjects = (
      mappedTerms: Table[],
      categories: number[],
      definitions: columnDefinition[],
      columns: Column[]
    ): TableParameters[] => {
      let tables: TableParameters[] = [];

      for (let category of categories) {
        //If the table category is general, use all tables
        let generalInfo = category === Category.General;
        const table = generalInfo
          ? mappedTerms
          : mappedTerms.filter((item: Columns) => item.Category == category);
        //Check to see if tables exist and contain items
        if (table) {
          if (table.length > 0) {
            //Get the columns that are relevant to the displayed table
            const fields = this.getColFields(definitions, columns).get(
              category
            );
            const { selected, displayed } = fields;
            const displayedColumns = Array.from(
              table.reduce((acc: Set<string>, curr: Table) => {
                // Iterate through each entry in a specific drug table
                for (let key in curr) {
                  const displayedFields = displayed.map((item) => item.field);
                  if (key === 'SearchTerm') {
                    acc.add(key);
                  } else if (curr[key] && displayedFields.includes(key)) {
                    acc.add(key);
                  }
                }
                return acc;
              }, new Set()) as Set<string>
            ) as string[];

            tables.push({
              id: category,
              tables: table,
              fields: displayedColumns,
              selected: [...selected.map((item) => item.field)],
            });
          }
        }
      }
      return tables;
    };

    this.activeTables.next(this.getTableNamesContainingData(mappedTerms));
    const tables = createTableObjects(
      mappedTerms,
      categories,
      this.columnDefinitions,
      this.columnOptions
    );*/
