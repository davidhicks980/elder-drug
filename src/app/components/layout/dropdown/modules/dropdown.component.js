"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DropdownComponent = void 0;
var core_1 = require("@angular/core");
var DropdownComponent = /** @class */ (function () {
    function DropdownComponent(nav) {
        this.hiddenTabs = nav.hiddenTabs;
    }
    DropdownComponent.prototype.ngOnInit = function () { };
    DropdownComponent = __decorate([
        core_1.Component({
            selector: 'elder-dropdown',
            template: "<div\n    role=\"menu\"\n    aria-haspopup=\"true\"\n    class=\"has-dropdown\"\n    tabindex=\"0\"\n  >\n    <button class=\"nav-button\">\n      <mat-icon\n        class=\"overflow-menu-button\"\n        svgIcon=\"overflow_menu_vertical\"\n      ></mat-icon>\n    </button>\n    <ul role=\"menubar\" aria-hidden=\"false\" class=\"nav-menu dropdown\">\n      <span *ngFor=\"let tab of hiddenTabs | async\"\n        ><li class=\"active\">\n          <button tabindex=\"0\" role=\"menuitem\" class=\"menu-item\">\n            <span class=\"ellipsis\">tab.ShortName</span>\n          </button>\n        </li>\n      </span>\n    </ul>\n  </div> ",
            styleUrls: ['./dropdown.component.scss']
        })
    ], DropdownComponent);
    return DropdownComponent;
}());
exports.DropdownComponent = DropdownComponent;
