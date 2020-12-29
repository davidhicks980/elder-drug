"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Cols = exports.ColumnService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ColumnService = /** @class */ (function () {
    function ColumnService() {
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
        this.columnDefinitions = [
            {
                description: 'General Info',
                filters: [null],
                id: 1,
                columnOptions: [
                    { id: Cols.SearchTerm, selected: true },
                    { id: Cols.Item, selected: true },
                    { id: Cols.Excl, selected: true },
                    { id: Cols.Incl, selected: true },
                    { id: Cols.Recommendation, selected: true },
                    { id: Cols.DiseaseState, selected: true },
                    { id: Cols.DrugInter, selected: false },
                    { id: Cols.ShortName, selected: true },
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
        // Observable string sources
        this.tableList = new rxjs_1.Subject();
        this.optionsList = new rxjs_1.Subject();
        // Observable string streams
        this.recieveTables$ = this.optionsList.asObservable();
        this.recieveOptions$ = this.tableList.asObservable();
    }
    ColumnService.prototype.sendTables = function (tables) {
        this.optionsList.next(tables);
    };
    ColumnService.prototype.sendOptions = function (options) {
        this.tableList.next(options);
    };
    ColumnService.prototype.mapData = function (data, filter) {
        var output = [];
        if (filter[0] != null || filter[1] != null) {
            data.forEach(function (element) {
                if (element[String(filter[0])] != null ||
                    element[String(filter[1])] != null) {
                    output.push(element);
                }
            });
        }
        else if (data.length == 0) {
            output = null;
        }
        else {
            output = data;
        }
        return output;
    };
    // Service message commands
    ColumnService.prototype.getColumnsForSelect = function (columnOptions) {
        return this.columnOptions.reduce(function (acc, curr) {
            if (columnOptions.includes(curr.id))
                acc.push(curr.header);
            return acc;
        }, []);
    };
    ColumnService.prototype.lookupColumns = function (columns, getAll) {
        var output = [];
        var _loop_1 = function (col) {
            if (col.selected && !getAll)
                output.push(this_1.columnOptions.filter(function (name) {
                    return name.id === col.id;
                })[0]);
        };
        var this_1 = this;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            _loop_1(col);
        }
        return output;
    };
    ColumnService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ColumnService);
    return ColumnService;
}());
exports.ColumnService = ColumnService;
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
    Cols[Cols["ShortName"] = 14] = "ShortName";
    Cols[Cols["SearchTerm"] = 15] = "SearchTerm";
})(Cols = exports.Cols || (exports.Cols = {}));
