"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModifyTablePanelComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/internal/Subject");
var ModifyTablePanelComponent = /** @class */ (function () {
    function ModifyTablePanelComponent(parameterService, state) {
        var _this = this;
        this.parameterService = parameterService;
        this.state = state;
        this.tableStore = new Map();
        this.tablesChanged = new Subject_1.Subject();
        this.options = [];
        this.loaded = new core_1.EventEmitter();
        this.layout = this.state.layoutStatus;
        this.pageLoaded = new Subject_1.Subject();
        this.state.requestComponentProperty('ModifyTablePanel', 'StateService', 'layoutStatus');
        this.state.windowWidth$.subscribe(function (layoutStatus) {
            _this.layout = layoutStatus;
        });
        this.options = this.parameterService.columnDefinitions.map(function (col) { return col.name; });
        this.tablesChanged.subscribe(function (store) {
            var selectedTables = [];
            for (var _i = 0, store_1 = store; _i < store_1.length; _i++) {
                var _a = store_1[_i], key = _a[0], value = _a[1];
                if (value) {
                    selectedTables.push(key);
                }
            }
            _this.state.emitSelectedTables(selectedTables);
        });
    }
    ModifyTablePanelComponent.prototype.updateOptions = function (selections) {
        this.state.emitSelectedTables(selections);
    };
    ModifyTablePanelComponent.prototype.isTableActive = function (table) {
        return this.tablesWithData.includes(table);
    };
    ModifyTablePanelComponent.prototype.processMobileCheckboxes = function (checked, name) {
        this.tableStore.set(name, checked);
        this.tablesChanged.next(this.tableStore);
    };
    ModifyTablePanelComponent.prototype.processDesktopCheckboxes = function (names) {
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name = names_1[_i];
            this.tableStore.set(name, true);
        }
        this.tablesChanged.next(this.tableStore);
    };
    ModifyTablePanelComponent.prototype.ngAfterViewInit = function () {
        this.loaded.emit(true);
    };
    __decorate([
        core_1.ViewChild('tableSelectionList')
    ], ModifyTablePanelComponent.prototype, "selectList");
    __decorate([
        core_1.Input()
    ], ModifyTablePanelComponent.prototype, "tablesWithData");
    __decorate([
        core_1.Output()
    ], ModifyTablePanelComponent.prototype, "loaded");
    ModifyTablePanelComponent = __decorate([
        core_1.Component({
            selector: 'modify-table-panel',
            template: " <div class=\"selection-panel\">\n    <div [fxShow.sm]=\"layout.sidenavOpen\" [fxShow.xs]=\"true\" fxHide>\n      <div style=\"margin-left:2%\">\n        <h3>Show Tables</h3>\n      </div>\n      <section>\n        <ul [class]=\"'toggle-group'\">\n          <li *ngFor=\"let option of options\">\n            <mat-checkbox\n              class=\"toggle-button\"\n              [disabled]=\"!this.tablesWithData.includes(option)\"\n              (change)=\"\n                processMobileCheckboxes($event.checked, $event.source.value)\n              \"\n              [value]=\"option\"\n              [checked]=\"this.tablesWithData.includes(option)\"\n            >\n              {{ option | caseSplit }}\n            </mat-checkbox>\n          </li>\n        </ul>\n      </section>\n    </div>\n\n    <div\n      class=\"table-modifier-list\"\n      [fxHide.sm]=\"layout.sidenavOpen ? true : false\"\n      [fxHide.xs]=\"true\"\n      fxShow\n    >\n      <div class=\"panel-header\">\n        <b>Active Tables</b>\n      </div>\n      <mat-selection-list\n        #tableSelectionList\n        (ngModelChange)=\"updateOptions($event)\"\n        [(ngModel)]=\"activeTables\"\n      >\n        <div fxFlex fxFlexAlign=\"center center\">\n          <mat-list-option\n            *ngFor=\"let option of options\"\n            [value]=\"option\"\n            [selected]=\"this.tablesWithData.includes(option)\"\n            [disabled]=\"!this.tablesWithData.includes(option)\"\n          >\n            <div class=\"list-text\">{{ option | caseSplit }}</div>\n          </mat-list-option>\n        </div>\n      </mat-selection-list>\n    </div>\n  </div>",
            styleUrls: ['./modify-table-panel.component.scss']
        })
    ], ModifyTablePanelComponent);
    return ModifyTablePanelComponent;
}());
exports.ModifyTablePanelComponent = ModifyTablePanelComponent;
