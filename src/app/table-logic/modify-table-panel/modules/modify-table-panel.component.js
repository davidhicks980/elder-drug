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
var ModifyTablePanelComponent = /** @class */ (function () {
    function ModifyTablePanelComponent(tableService, state, fb, columnService) {
        var _this = this;
        this.tableService = tableService;
        this.state = state;
        this.fb = fb;
        this.columnService = columnService;
        this.activeTables = []; // Subject<string[]> = new Subject();
        this.layout = this.state.layoutStatus;
        this.tableOptions = this.fb.group({
            optionControls: this.fb.array([])
        });
        this.checkboxOrder = new Map();
        state.smallContent$.subscribe(function (i) { return console.log(i); });
        this.options = columnService.columnDefinitions.map(function (col) {
            return { id: col.id, description: col.description };
        });
        this.tableService.tableStatus$.subscribe(function (tables) {
            _this.enabledTables = tables;
        });
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var option = _a[_i];
            this.enabledTables.includes(option.id)
                ? this.addTable(false, option.id)
                : this.addTable(true, option.id);
        }
        this.formOptions.valueChanges.subscribe(function (tables) {
            _this.tableService.emitSelectedTables(_this.find(true, tables).map(function (item) { return _this.checkboxOrder.get(item); }));
        });
    }
    Object.defineProperty(ModifyTablePanelComponent.prototype, "formOptions", {
        get: function () {
            return this.tableOptions.get('optionControls');
        },
        enumerable: false,
        configurable: true
    });
    ModifyTablePanelComponent.prototype.addTable = function (disabled, value) {
        var i = this.formOptions.length;
        this.formOptions.insert(i, this.fb.control({ value: !disabled, disabled: disabled }));
        this.checkboxOrder.set(i, value);
    };
    ModifyTablePanelComponent.prototype.ngAfterViewInit = function () {
        this.loaded = true;
    };
    ModifyTablePanelComponent.prototype.find = function (needle, haystack) {
        var results = [];
        var idx = haystack.indexOf(needle);
        while (idx != -1) {
            results.push(idx);
            idx = haystack.indexOf(needle, idx + 1);
        }
        return results;
    };
    __decorate([
        core_1.ViewChild('tableSelectionList')
    ], ModifyTablePanelComponent.prototype, "selectList");
    ModifyTablePanelComponent = __decorate([
        core_1.Component({
            selector: 'modify-table-panel',
            template: " <form [formGroup]=\"tableOptions\">\n    <div\n      class=\"panel-container\"\n      [class.small-screen]=\"this.state.smallContent$ | async\"\n    >\n      <span\n        style=\"font: 400 16pt 'IBM Plex Sans', sans-serif; margin: 0 0 0 10px\"\n      >\n        Show Tables\n      </span>\n\n      <ul\n        [class.small-screen]=\"this.state.smallContent$ | async\"\n        formArrayName=\"optionControls\"\n      >\n        <li\n          matRipple\n          matRippleColor=\"#00a9924a\"\n          *ngFor=\"let option of formOptions.controls; let i = index\"\n          [class.selected]=\"formOptions.at(i).value\"\n          [class.disabled]=\"formOptions.at(i).disabled\"\n        >\n          <label\n            [style.direction]=\"\n              (this.state.smallContent$ | async) ? 'rtl' : 'ltr'\n            \"\n            [for]=\"'checkbox_' + i\"\n            class=\"checkbox\"\n          >\n            <span class=\"checkbox-label\">{{ options[i].description }}</span>\n\n            <span class=\"checkbox-input\">\n              <input\n                [id]=\"'checkbox_' + i\"\n                [formControlName]=\"i\"\n                checked=\"checked\"\n                type=\"checkbox\"\n                name=\"checkbox\"\n              />\n              <span class=\"checkbox-control\">\n                <svg\n                  xmlns=\"http://www.w3.org/2000/svg\"\n                  viewBox=\"0 0 24 24\"\n                  aria-hidden=\"true\"\n                  focusable=\"false\"\n                >\n                  <path\n                    fill=\"none\"\n                    stroke=\"currentColor\"\n                    stroke-width=\"3\"\n                    d=\"M1.73 12.91l6.37 6.37L22.79 4.59\"\n                  />\n                </svg>\n              </span>\n            </span>\n          </label>\n        </li>\n      </ul>\n    </div>\n  </form>",
            styleUrls: ['./modify-table-panel.component.scss']
        })
    ], ModifyTablePanelComponent);
    return ModifyTablePanelComponent;
}());
exports.ModifyTablePanelComponent = ModifyTablePanelComponent;
