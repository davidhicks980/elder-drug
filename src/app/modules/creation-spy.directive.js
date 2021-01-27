"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreationSpyDirective = void 0;
var core_1 = require("@angular/core");
var CreationSpyDirective = /** @class */ (function () {
    function CreationSpyDirective() {
        this.spyInit = new core_1.EventEmitter();
    }
    CreationSpyDirective.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () { return _this.spyInit.emit(true); }, 1000);
    };
    CreationSpyDirective.prototype.ngOnDestroy = function () {
        this.spyInit.emit(false);
    };
    __decorate([
        core_1.Output('SpyInit')
    ], CreationSpyDirective.prototype, "spyInit");
    CreationSpyDirective = __decorate([
        core_1.Directive({ selector: '[CreationSpy]' })
    ], CreationSpyDirective);
    return CreationSpyDirective;
}());
exports.CreationSpyDirective = CreationSpyDirective;
