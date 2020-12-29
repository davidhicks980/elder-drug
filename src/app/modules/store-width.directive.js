"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StoreWidthDirective = void 0;
var core_1 = require("@angular/core");
var StoreWidthDirective = /** @class */ (function () {
    function StoreWidthDirective(el) {
        this.el = el;
    }
    StoreWidthDirective.prototype.onResize = function () { };
    StoreWidthDirective.prototype.checkBreakpoint = function (size) { };
    __decorate([
        core_1.HostListener('onresize')
    ], StoreWidthDirective.prototype, "onResize");
    __decorate([
        core_1.Input('breakpoint')
    ], StoreWidthDirective.prototype, "breakpoint");
    StoreWidthDirective = __decorate([
        core_1.Directive({
            selector: '[appStoreWidth]'
        })
    ], StoreWidthDirective);
    return StoreWidthDirective;
}());
exports.StoreWidthDirective = StoreWidthDirective;
