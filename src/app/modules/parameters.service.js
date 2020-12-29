"use strict";
exports.__esModule = true;
exports.ColumnService = exports.Cols = void 0;
var rxjs_1 = require("rxjs");
var Cols;
(function (Cols) {
    Cols[Cols["EntryID"] = 0] = "EntryID";
    Cols[Cols["DiseaseState"] = 1] = "DiseaseState";
    Cols[Cols["Category"] = 2] = "Category";
    Cols[Cols["TableDefinition"] = 3] = "TableDefinition";
    Cols[Cols["Item"] = 4] = "Item";
    Cols[Cols["MinCl"] = 5] = "MinCl";
    Cols[Cols["MaxCl"] = 6] = "MaxCl";
    Cols[Cols["DrugInter"] = 7] = "DrugInter";
    Cols[Cols["Incl"] = 8] = "Incl";
    Cols[Cols["Excl"] = 9] = "Excl";
    Cols[Cols["Rationale"] = 10] = "Rationale";
    Cols[Cols["Recommendation"] = 11] = "Recommendation";
    Cols[Cols["RecommendationLineTwo"] = 12] = "RecommendationLineTwo";
    Cols[Cols["ShortName"] = 13] = "ShortName";
    Cols[Cols["SearchTerm"] = 14] = "SearchTerm";
})(Cols = exports.Cols || (exports.Cols = {}));
var ColumnService = /** @class */ (function () {
    function ColumnService() {
        this.allColumns = [
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
        this.tables = [
            {
                TableNumber: 2,
                TableDefinition: 'Potentially Inappropriate Medication Use in Older Adults ',
                ShortName: 'Potentially Innappropriate',
                Identifier: 'PotenInappropriate'
            },
            {
                TableNumber: 3,
                TableDefinition: 'Potentially Inappropriate Medication Use in Older Adults Due to Drug-Disease or Drug-Syndrome Interactions That May Exacerbate the Disease or Syndrome',
                ShortName: 'Disease-Specific',
                Identifier: 'DiseaseGuidance'
            },
            {
                TableNumber: 4,
                TableDefinition: 'Drugs To Be Used With Caution in Older Adults',
                ShortName: 'Use with Caution',
                Identifier: 'Caution'
            },
            {
                TableNumber: 5,
                TableDefinition: 'Potentially Clinically Important Drug-Drug Interactions That Should Be Avoided in Older Adults',
                ShortName: 'Drug Interactions',
                Identifier: 'DrugInteractions'
            },
            {
                TableNumber: 6,
                TableDefinition: 'Medications That Should Be Avoided or Have Their Dosage Reduced With Varying Levels of Kidney Function in Older Adults',
                ShortName: 'Renal Interactions',
                Identifier: 'Clearance'
            },
            {
                TableNumber: 7,
                TableDefinition: 'Drugs With Strong Anticholinergic Properties',
                ShortName: 'Anticholinergics',
                Identifier: 'Anticholinergics'
            },
        ];
        this.columnDefinitions = [
            {
                description: 'General Info',
                filters: [null],
                id: 8,
                columnOptions: [
                    { col: Cols.SearchTerm, selected: true },
                    { col: Cols.Item, selected: true },
                    { col: Cols.Excl, selected: true },
                    { col: Cols.Incl, selected: true },
                    { col: Cols.Recommendation, selected: true },
                    { col: Cols.DiseaseState, selected: true },
                    { col: Cols.DrugInter, selected: false },
                    { col: Cols.ShortName, selected: true },
                ]
            },
            {
                description: 'Disease-Specific',
                filters: [Cols.DiseaseState],
                id: 3,
                columnOptions: [
                    { col: Cols.SearchTerm, selected: true },
                    { col: Cols.Item, selected: true },
                    { col: Cols.Excl, selected: true },
                    { col: Cols.Incl, selected: true },
                    { col: Cols.Recommendation, selected: false },
                    { col: Cols.DiseaseState, selected: true },
                ]
            },
            {
                description: 'Renal Interactions',
                id: 6,
                filters: [Cols.MaxCl, Cols.MinCl],
                columnOptions: [
                    { col: Cols.SearchTerm, selected: true },
                    { col: Cols.Item, selected: true },
                    { col: Cols.MinCl, selected: true },
                    { col: Cols.MaxCl, selected: true },
                    { col: Cols.Incl, selected: false },
                    { col: Cols.Excl, selected: false },
                    { col: Cols.Recommendation, selected: true },
                ]
            },
            {
                description: 'Drug Interactions',
                filters: [Cols.DrugInter],
                id: 5,
                columnOptions: [
                    { col: Cols.SearchTerm, selected: true },
                    { col: Cols.Item, selected: true },
                    { col: Cols.DrugInter, selected: true },
                    { col: Cols.Incl, selected: true },
                    { col: Cols.Excl, selected: true },
                    { col: Cols.Recommendation, selected: true },
                    { col: Cols.Rationale, selected: false },
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
    ColumnService.prototype.lookupColumns = function (columns) {
        var output = [];
        var _loop_1 = function (col) {
            output.push(this_1.allColumns.filter(function (name) {
                return name.field === col;
            })[0]);
        };
        var this_1 = this;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            _loop_1(col);
        }
        return output;
    };
    return ColumnService;
}());
exports.ColumnService = ColumnService;
