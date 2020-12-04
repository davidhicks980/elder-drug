"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MedTableComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("../../animations");
var animations_2 = require("../../animations");
var MedTableComponent = /** @class */ (function () {
    function MedTableComponent(parameterService, iconRegistry, sanitizer, state) {
        this.parameterService = parameterService;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.state = state;
        this.rows = [];
        this.selectOptions = [];
        this.loaded = false;
        this.selectorInitiated = false;
        this.rationale = [];
        iconRegistry.addSvgIcon('error', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg'));
        iconRegistry.addSvgIcon('unfold_less', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_less.svg'));
        iconRegistry.addSvgIcon('remove_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove_circle_outline.svg'));
        iconRegistry.addSvgIcon('add_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_circle_outline.svg'));
        iconRegistry.addSvgIcon('unfold_more', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_more.svg'));
        iconRegistry.addSvgIcon('expand_less', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_less.svg'));
        iconRegistry.addSvgIcon('chevron_right', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_right.svg'));
    }
    MedTableComponent.prototype.changeActiveColumns = function (cols) {
        this.columnOptions = this.parameterService.lookupColumns(cols);
    };
    MedTableComponent.prototype.expandRationale = function (index) {
        this.rationale[index].expanded = !this.rationale[index].expanded;
    };
    MedTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.tableName = this.tableData['key'];
        var initOptions = this.parameterService.columnDefinitions.filter(function (item) {
            return item.name === _this.tableName;
        })[0];
        this.columnOptions = this.parameterService
            .lookupColumns(initOptions.selectedColumns)
            .filter(Boolean);
        this.expandFieldData = this.parameterService
            .lookupColumns(initOptions.columnOptions)
            .filter(Boolean);
        this.rows = this.tableData['value'];
        if (this.columnOptions) {
            for (var _i = 0, _a = this.columnOptions; _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectOptions.push(item.field);
            }
        }
    };
    MedTableComponent.prototype.toggleExpandRow = function (row) {
        this.table.rowDetail.toggleExpandRow(row);
    };
    MedTableComponent.prototype.onDetailToggle = function () { };
    MedTableComponent.prototype.ngOnChanges = function () {
        this.rows = this.tableData['value'];
        this.setExpandedVariables(this.rows);
    };
    MedTableComponent.prototype.setExpandedVariables = function (rows) {
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var _a = rows_1[_i];
            this.rationale.push({ expanded: true });
        }
    };
    __decorate([
        core_1.ViewChild('myTable')
    ], MedTableComponent.prototype, "table");
    __decorate([
        core_1.Input()
    ], MedTableComponent.prototype, "tableData");
    MedTableComponent = __decorate([
        core_1.Component({
            selector: 'app-med-table',
            templateUrl: './med-table.component.html',
            styleUrls: ['./med-table.component.scss'],
            animations: [
                animations_2.expandButtonAnimation,
                animations_2.translateRationaleContent,
                animations_1.slideDownAnimation,
                animations_1.fadeInAnimation,
            ]
        })
    ], MedTableComponent);
    return MedTableComponent;
}());
exports.MedTableComponent = MedTableComponent;
