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
var animations_1 = require("../animations");
var ContentComponent = /** @class */ (function () {
    function ContentComponent(firestore, parameterService, state, widthObserver) {
        var _this = this;
        this.firestore = firestore;
        this.parameterService = parameterService;
        this.state = state;
        this.widthObserver = widthObserver;
        this.active = false;
        this.trackByFn = function (_, item) { return item.id; };
        this.tablesLoaded = new core_1.EventEmitter();
        firestore.groupedTables.subscribe(function (items) {
            _this.tables = items;
            _this.tablesWithData = _this.parameterService.filterActiveTables(items);
            _this.activeTables = _this.tablesWithData;
            _this.loaded = true;
            _this.tablesLoaded.emit(true);
        });
        this.state.windowWidth$.subscribe(function (screenSize) {
            if ((_this.sidenavActive && screenSize === 'SMALL') ||
                screenSize === 'XSMALL') {
                _this.smallScreen = true;
            }
            else {
                _this.smallScreen = false;
            }
        });
        this.state.tableStatus$.subscribe(function (active) {
            _this.activeTables = active;
        });
        this.state.sidenavStatus$.subscribe(function (sidenavOpen) {
            _this.smallScreen = sidenavOpen
                ? _this.widthObserver.isMatched('(max-width: 959.59px)')
                : _this.widthObserver.isMatched('(max-width: 599px)');
            _this.sidenavActive = sidenavOpen;
        });
    }
    __decorate([
        core_1.Output()
    ], ContentComponent.prototype, "tablesLoaded");
    ContentComponent = __decorate([
        core_1.Component({
            selector: 'app-content',
            template: "\n    <div\n      [class]=\"\n        sidenavActive ? 'sidenav-open content' : 'sidenav-closed content'\n      \"\n    >\n      <div\n        [hidden]=\"loaded\"\n        class=\"main-content-box\"\n        fxLayout=\"row\"\n        [fxLayout.sm]=\"sidenavActive ? 'column' : 'row'\"\n        fxLayout.xs=\"column\"\n      >\n        <div\n          [fxFlexOrder.sm]=\"sidenavActive ? '2' : '1'\"\n          fxFlexOrder.xs=\"2\"\n          fxFlexOrder=\"1\"\n          fxShrink=\"0\"\n        >\n          <div\n            *ngFor=\"let table of tables | keyvalue; trackBy: trackByFn\"\n            [class]=\"\n              sidenavActive ? 'sidenav-open tables' : 'sidenav-closed tables'\n            \"\n          >\n            <app-med-table\n              *ngIf=\"this.activeTables.includes(table.key)\"\n              [tableData]=\"table\"\n            >\n            </app-med-table>\n            <div class=\"table-spacer\"></div>\n          </div>\n          <br />\n        </div>\n        <div\n          #modifyPanel\n          [fxFlexOrder.sm]=\"sidenavActive ? '1' : '2'\"\n          fxFlexOrder.xs=\"1\"\n          fxFlexOrder=\"2\"\n        >\n          <modify-table-panel\n            *ngIf=\"loaded\"\n            [tablesWithData]=\"tablesWithData\"\n          ></modify-table-panel>\n        </div>\n      </div>\n    </div>\n  ",
            styleUrls: ['./content.component.scss'],
            animations: [animations_1.fadeInAnimation, animations_1.tableVisibleAnimation, animations_1.contentAnimation]
        })
    ], ContentComponent);
    return ContentComponent;
}());
exports.ContentComponent = ContentComponent;
