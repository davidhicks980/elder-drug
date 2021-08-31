"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ToggleOptionsComponent = void 0;
var core_1 = require("@angular/core");
var ToggleOptionsComponent = /** @class */ (function () {
    function ToggleOptionsComponent() {
    }
    ToggleOptionsComponent.prototype.updateOptions = function (selection) {
        var outArray = [];
        for (var _i = 0, _a = this.options; _i < _a.length; _i++) {
            var item = _a[_i];
            outArray.push(item[String(selection)]);
            this.options = __spreadArrays(new Set(outArray)).filter(function (item) { return item; });
        }
    };
    __decorate([
        core_1.Input()
    ], ToggleOptionsComponent.prototype, "keys");
    __decorate([
        core_1.Output()
    ], ToggleOptionsComponent.prototype, "buttonSelection");
    ToggleOptionsComponent = __decorate([
        core_1.Component({
            selector: 'elder-toggle-options',
            templateUrl: './toggle-options.component.html',
            styleUrls: ['./toggle-options.component.scss']
        })
    ], ToggleOptionsComponent);
    return ToggleOptionsComponent;
}());
exports.ToggleOptionsComponent = ToggleOptionsComponent;
