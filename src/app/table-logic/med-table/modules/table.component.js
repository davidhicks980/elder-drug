"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MedTableComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var sort_1 = require("@angular/material/sort");
var table_1 = require("@angular/material/table");
var operators_1 = require("rxjs/operators");
var animations_2 = require("../../animations");
var MedTableComponent = /** @class */ (function () {
    function MedTableComponent(parameterService, firebase, columnService, tableService, stateService) {
        var _this = this;
        this.parameterService = parameterService;
        this.firebase = firebase;
        this.columnService = columnService;
        this.tableService = tableService;
        this.stateService = stateService;
        this.rows = [];
        this.selectOptions = [];
        this.loaded = false;
        this.selectorInitiated = false;
        this.dataSource = new table_1.MatTableDataSource();
        this.firebase = firebase;
        this.columnService = columnService;
        this.tableService.tableStatus$.subscribe(function (active) {
            _this.enabledTables = active;
        });
    }
    MedTableComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
    };
    MedTableComponent.prototype.moveSearchTerms = function (arr, item) {
        var index = arr.indexOf(item);
        arr.splice(index, 1);
        arr.unshift(item);
    };
    MedTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        var table = this.firebase.groupedTables$.pipe(operators_1.filter(function (item) { return item.id === _this.tableName; }));
        table.subscribe(function (params) {
            _this.fields = params.selected;
            _this.dataSource.data = params.tables;
            _this.expandedFields = params.fields;
            _this.moveSearchTerms(_this.fields, 'SearchTerm');
        });
        this.loaded = true;
    };
    __decorate([
        core_1.ViewChild('medTable')
    ], MedTableComponent.prototype, "table");
    __decorate([
        core_1.Input()
    ], MedTableComponent.prototype, "tableName");
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], MedTableComponent.prototype, "sort");
    MedTableComponent = __decorate([
        core_1.Component({
            selector: 'app-table',
            templateUrl: './table.component.html',
            styleUrls: ['./med-table.component.scss'],
            animations: [
                animations_1.trigger('expandButton', [
                    animations_1.state('default', animations_1.style({ transform: 'rotate(0deg)' })),
                    animations_1.state('rotated', animations_1.style({ transform: 'rotate(90deg)' })),
                    animations_1.transition('rotated => default', animations_1.animate('400ms ease-out')),
                    animations_1.transition('default => rotated', animations_1.animate('400ms ease-in')),
                ]),
                animations_2.slideDownAnimation,
                animations_1.trigger('rotateChevron', [
                    animations_1.state('collapsed', animations_1.style({ transform: 'rotate(0deg)' })),
                    animations_1.state('expanded', animations_1.style({ transform: 'rotate(-90deg)' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
                animations_1.trigger('translateRationale', [
                    animations_1.state('expanded', animations_1.style({ transform: 'translateY(0)' })),
                    animations_1.state('closed', animations_1.style({ transform: 'translateY(-200px)' })),
                    animations_1.transition('closed<=>expanded', animations_1.animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                    animations_1.transition('expanded<=>closed', animations_1.animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
                animations_1.trigger('detailExpand', [
                    animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                    animations_1.state('expanded', animations_1.style({ height: '*' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
            ]
        })
    ], MedTableComponent);
    return MedTableComponent;
}());
exports.MedTableComponent = MedTableComponent;
