"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TabComponent = void 0;
var core_1 = require("@angular/core");
var TabComponent = /** @class */ (function () {
    function TabComponent(nav, tables, columns) {
        this.itemCount = 1;
        this.tableSelected = new core_1.EventEmitter();
        this.nav = nav;
        this.shownTabs = this.nav.showTabs ? this.nav.allTabs : this.nav.shownTabs;
        this.columns = columns;
        this.columns.requestTable(3);
    }
    TabComponent.prototype.handleTabClick = function (table, tabIndex) {
        this.currentTab = tabIndex;
        this.columns.requestTable(table);
        this.tableSelected.emit(true);
    };
    TabComponent.prototype.ngAfterViewInit = function () {
        this.nav.createIntersectionObserver(document.querySelector('.tabs'));
    };
    __decorate([
        core_1.Output()
    ], TabComponent.prototype, "tableSelected");
    TabComponent = __decorate([
        core_1.Component({
            selector: 'elder-tabs',
            template: "\n    <div class=\"tabs\" [style.width]=\"nav.width\">\n      <ul class=\"button-row-style\">\n        <ng-container *ngFor=\"let tab of shownTabs | async; index as index\">\n          <li\n            [style.zIndex]=\"index === currentTab ? 1 : 0\"\n            class=\"tab-button-li\"\n            (click)=\"handleTabClick(tab.TableNumber, index)\"\n          >\n            <div\n              [class.active]=\"index === currentTab\"\n              [class.inactive]=\"index != currentTab\"\n              [class.collapse]=\"index != 0\"\n              class=\"tab-button\"\n            >\n              <a> {{ tab.ShortName }}</a>\n            </div>\n          </li>\n        </ng-container>\n      </ul>\n    </div>\n  ",
            styleUrls: ['./tab.component.scss']
        })
    ], TabComponent);
    return TabComponent;
}());
exports.TabComponent = TabComponent;
