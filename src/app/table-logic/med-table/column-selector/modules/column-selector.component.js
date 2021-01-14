"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ColumnSelectorComponent = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var ColumnSelectorComponent = /** @class */ (function () {
    function ColumnSelectorComponent(columnService, firebase) {
        this.columnService = columnService;
        this.firebase = firebase;
        this.columnUpdates = new core_1.EventEmitter();
        this.loaded = new core_1.EventEmitter();
        this.columnService = columnService;
    }
    ColumnSelectorComponent.prototype.emitUpdatedColumns = function (cols) {
        this.columnUpdates.emit(cols);
    };
    ColumnSelectorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.selectedOptions.subscribe(function (item) { return (_this.selectOptions = item); });
        this.loaded.emit(true);
    };
    ColumnSelectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        var options = this.firebase.filteredFields$.pipe(operators_1.filter(function (item) { return item.id === _this.tableName; }));
        this.displayedOptions = options.pipe(operators_1.pluck('fields'));
        this.selectedOptions = options.pipe(operators_1.pluck('selected'));
        /* this.displayedOptions = this.firebase.filteredFields$.pipe( filter( item => item.id === this.tableName ), map( val => val.fields.entries() ), toArray() ).subscribe(item=>console.log(item))*/
    };
    __decorate([
        core_1.ViewChild('columnSelect')
    ], ColumnSelectorComponent.prototype, "selector");
    __decorate([
        core_1.Input()
    ], ColumnSelectorComponent.prototype, "tableName");
    __decorate([
        core_1.Output()
    ], ColumnSelectorComponent.prototype, "columnUpdates");
    __decorate([
        core_1.Output()
    ], ColumnSelectorComponent.prototype, "loaded");
    ColumnSelectorComponent = __decorate([
        core_1.Component({
            selector: 'app-column-selector',
            template: "<mat-form-field color=\"primary\" *ngIf=\"selectOptions\">\n    <mat-label>Change Columns</mat-label>\n    <mat-select\n      #columnSelect\n      class=\"column-select\"\n      multiple\n      [ngModel]=\"selectOptions\"\n      (ngModelChange)=\"emitUpdatedColumns($event)\"\n    >\n      <mat-option\n        *ngFor=\"let column of displayedOptions | async\"\n        [value]=\"column\"\n      >\n        {{ column | caseSplit }}\n      </mat-option>\n    </mat-select>\n  </mat-form-field> ",
            styleUrls: ['./column-selector.component.scss']
        })
    ], ColumnSelectorComponent);
    return ColumnSelectorComponent;
}());
exports.ColumnSelectorComponent = ColumnSelectorComponent;
