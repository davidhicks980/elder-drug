"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ParametersService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ParametersService = /** @class */ (function () {
    function ParametersService() {
        this.allColumns = [
            { field: 'EntryID', header: 'Entry Number' },
            { field: 'DiseaseState', header: 'Disease State' },
            { field: 'Category', header: 'Category Number' },
            { field: 'TableDefinition', header: 'Table Definition' },
            { field: 'Item', header: 'Item' },
            { field: 'MinimumClearance', header: 'Min Clearance' },
            { field: 'MaximumClearance', header: 'Max Clearance' },
            { field: 'DrugInteraction', header: 'Drug Interaction' },
            { field: 'Inclusion', header: 'Includes' },
            { field: 'Exclusion', header: 'Excludes' },
            { field: 'Rationale', header: 'Rationale' },
            { field: 'Recommendation', header: 'Recommendation' },
            { field: 'RecommendationLineTwo', header: 'LineTwo' },
            { field: 'ItemType', header: 'Type' },
            { field: 'ShortTableName', header: 'Table' },
            { field: 'SearchTerm', header: 'Search Term' },
        ];
        this.columnDefinitions = [
            {
                description: 'General Info',
                active: true,
                filters: [null],
                name: 'GeneralInfo',
                columnOptions: [
                    'SearchTerm',
                    'ShortTableName',
                    'Item',
                    'Inclusion',
                    'Exclusion',
                    'Recommendation',
                    'DiseaseState',
                    'DrugInteraction',
                ],
                selectedColumns: [
                    'SearchTerm',
                    'Item',
                    'ShortTableName',
                    'Recommendation',
                ]
            },
            {
                description: 'Disease-Specific',
                active: true,
                filters: ['DiseaseState'],
                name: 'DiseaseGuidance',
                columnOptions: [
                    'SearchTerm',
                    'Item',
                    'Inclusion',
                    'Exclusion',
                    'Recommendation',
                ],
                selectedColumns: ['DiseaseState', 'SearchTerm', 'Item', 'Recommendation']
            },
            {
                description: 'Clearance Ranges',
                name: 'Clearance',
                active: true,
                filters: ['MaximumClearance', 'MinimumClearance'],
                columnOptions: [
                    'SearchTerm',
                    'Item',
                    "MinimumClearance",
                    "MaximumClearance",
                    'Inclusion',
                    'Exclusion',
                    'Recommendation',
                ],
                selectedColumns: [
                    'SearchTerm',
                    'Item',
                    "MinimumClearance",
                    "MaximumClearance",
                    'Recommendation',
                ]
            },
            {
                description: 'Drug Interactions',
                active: true,
                filters: ['DrugInteraction'],
                name: 'DrugInteraction',
                columnOptions: [
                    'SearchTerm',
                    'Item',
                    "DrugInteraction",
                    'Inclusion',
                    'Exclusion',
                    'Rationale',
                    'Recommendation',
                ],
                selectedColumns: [
                    "SearchTerm",
                    "Item",
                    "DrugInteraction",
                    "Inclusion",
                    "Exclusion",
                    "Recommendation",
                ]
            },
        ];
        // Observable string sources
        this.tableList = new rxjs_1.Subject();
        this.optionsList = new rxjs_1.Subject();
        this.name = 'ParametersService';
        // Observable string streams
        this.recieveTables$ = this.optionsList.asObservable();
        this.recieveOptions$ = this.tableList.asObservable();
    }
    ParametersService.prototype.sendTables = function (tables) {
        this.optionsList.next(tables);
    };
    ParametersService.prototype.sendOptions = function (options) {
        this.tableList.next(options);
    };
    ParametersService.prototype.mapData = function (data, filter) {
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
    ParametersService.prototype.filterActiveTables = function (tables) {
        var output = [];
        for (var _i = 0, _a = Object.entries(tables); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var len = value.length;
            if (len > 0) {
                output.push(key);
            }
        }
        return output;
    };
    // Service message commands
    ParametersService.prototype.lookupColumns = function (columns) {
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
    ParametersService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ParametersService);
    return ParametersService;
}());
exports.ParametersService = ParametersService;
