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
    function MedTableComponent(parameterService, iconRegistry, sanitizer, firebase, columnService, tableService, stateService) {
        var _this = this;
        this.parameterService = parameterService;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.firebase = firebase;
        this.columnService = columnService;
        this.tableService = tableService;
        this.stateService = stateService;
        this.rows = [];
        this.selectOptions = [];
        this.loaded = false;
        this.selectorInitiated = false;
        this.rationale = [];
        this.firebase = firebase;
        this.columnService = columnService;
        this.tableService.tableStatus$.subscribe(function (active) {
            _this.enabledTables = active;
        });
        iconRegistry.addSvgIcon('error', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg'));
        iconRegistry.addSvgIcon('unfold_less', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_less.svg'));
        iconRegistry.addSvgIcon('remove_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove_circle_outline.svg'));
        iconRegistry.addSvgIcon('add_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_circle_outline.svg'));
        iconRegistry.addSvgIcon('unfold_more', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_more.svg'));
        iconRegistry.addSvgIcon('expand_less', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_less.svg'));
        iconRegistry.addSvgIcon('chevron_right', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_right.svg'));
    }
    MedTableComponent.prototype.log = function (e) {
        console.log(e);
    };
    MedTableComponent.prototype.expandRationale = function (index) {
        this.rationale[index].expanded = !this.rationale[index].expanded;
    };
    MedTableComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
    };
    MedTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        var table = this.firebase.groupedTables$.pipe(operators_1.filter(function (item) { return item.id === _this.tableName; }));
        table.subscribe(function (params) {
            params.selected.unshift('expand');
            _this.fields = params.selected;
            _this.dataSource = new table_1.MatTableDataSource(params.tables);
            _this.expandedFields = params.fields;
        });
        this.loaded = true;
    };
    MedTableComponent.prototype.setExpandedVariables = function (rows) {
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var _a = rows_1[_i];
            this.rationale.push({ expanded: true });
        }
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
                animations_2.expandButtonAnimation,
                animations_2.translateRationaleContent,
                animations_2.slideDownAnimation,
                animations_1.trigger('rotateChevron', [
                    animations_1.state('collapsed', animations_1.style({ transform: 'rotate(0deg)' })),
                    animations_1.state('expanded', animations_1.style({ transform: 'rotate(-90deg)' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
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
