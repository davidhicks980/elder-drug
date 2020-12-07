"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ContentComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var ContentComponent = /** @class */ (function () {
    function ContentComponent(firestore, parameterService, state, widthObserver) {
        var _this = this;
        this.firestore = firestore;
        this.parameterService = parameterService;
        this.state = state;
        this.widthObserver = widthObserver;
        this.loaded = false;
        this.active = false;
        this.tablesWithData = [];
        this.trackByFn = function (_, item) { return item.id; };
        this.tablesLoaded = new core_1.EventEmitter();
        this.tables = [];
        firestore.groupedTables.subscribe(function (items) {
            _this.tables = items;
            _this.tablesWithData = _this.parameterService.filterActiveTables(items);
            _this.loaded = true;
            _this.activeTables = _this.tablesWithData;
            _this.tablesLoaded.emit(true);
        });
        this.state.windowWidth$.subscribe(function (layoutStatus) {
            _this.layout = layoutStatus;
        });
        this.state.tableStatus$.subscribe(function (active) {
            _this.activeTables = active;
        });
    }
    __decorate([
        core_1.Output()
    ], ContentComponent.prototype, "tablesLoaded");
    ContentComponent = __decorate([
        core_1.Component({
            selector: 'app-content',
            template: "\n    <div\n      [class]=\"\n        layout.sidenavOpen ? 'sidenav-open content' : 'sidenav-closed content'\n      \"\n    >\n      <div\n        *ngIf=\"loaded\"\n        class=\"main-content-box\"\n        fxLayout=\"row\"\n        [fxLayout.sm]=\"layout.sidenavOpen ? 'column' : 'row'\"\n        fxLayout.xs=\"column\"\n        [@fadeIn]=\"loaded\"\n      >\n        <div\n          [fxFlexOrder.sm]=\"layout.sidenavOpen ? '2' : '1'\"\n          fxFlexOrder.xs=\"2\"\n          fxFlexOrder=\"1\"\n          fxShrink=\"0\"\n        >\n          <div\n            *ngFor=\"let table of tables | keyvalue; trackBy: trackByFn\"\n            [class]=\"\n              layout.sidenavOpen\n                ? 'sidenav-open tables'\n                : 'sidenav-closed tables'\n            \"\n          >\n            <app-med-table\n              *ngIf=\"activeTables.includes(table.key)\"\n              [tableData]=\"table\"\n            >\n            </app-med-table>\n            <div class=\"table-spacer\"></div>\n          </div>\n          <br />\n        </div>\n        <div\n          #modifyPanel\n          [fxFlexOrder.sm]=\"layout.sidenavOpen ? '1' : '2'\"\n          fxFlexOrder.xs=\"1\"\n          fxFlexOrder=\"2\"\n        >\n          <modify-table-panel\n            [tablesWithData]=\"activeTables\"\n          ></modify-table-panel>\n        </div>\n      </div>\n    </div>\n  ",
            styleUrls: ['./content.component.scss'],
            animations: [
                animations_1.trigger('fadeIn', [
                    animations_1.transition(':enter', [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('2s', animations_1.style({ opacity: 1 })),
                    ]),
                    animations_1.transition(':leave', [animations_1.animate('2s', animations_1.style({ opacity: 0 }))]),
                ]),
            ]
        })
    ], ContentComponent);
    return ContentComponent;
}());
exports.ContentComponent = ContentComponent;
