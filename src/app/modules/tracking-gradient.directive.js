"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TrackingGradientDirective = void 0;
var core_1 = require("@angular/core");
var TrackingGradientDirective = /** @class */ (function () {
    function TrackingGradientDirective(el) {
        this.el = el;
        this.element.style.backgroundRepeat = 'no-repeat';
    }
    Object.defineProperty(TrackingGradientDirective.prototype, "element", {
        get: function () {
            return this.el.nativeElement;
        },
        enumerable: false,
        configurable: true
    });
    TrackingGradientDirective.prototype.onMouseMove = function ($event) {
        this.changeBackgroundPosition(Math.floor($event.offsetX) + "px " + Math.floor($event.offsetY) + "px");
    };
    TrackingGradientDirective.prototype.onMouseEnter = function () {
        this.renderHighlightBackground();
    };
    TrackingGradientDirective.prototype.onMouseLeave = function () {
        this.renderDefaultBackground();
    };
    TrackingGradientDirective.prototype.renderDefaultBackground = function () {
        this.element.style.background = this.trackBackground;
    };
    TrackingGradientDirective.prototype.renderHighlightBackground = function () {
        this.element.style.background = "radial-gradient(circle at center, " + (this.trackBackground + '80% , ' + this.trackHighlight + '90%') + ")";
        this.element.style.backgroundSize = '200%';
    };
    TrackingGradientDirective.prototype.changeBackgroundPosition = function (coordinate) {
        this.element.style.backgroundPosition = coordinate;
    };
    __decorate([
        core_1.Input()
    ], TrackingGradientDirective.prototype, "trackHighlight");
    __decorate([
        core_1.Input()
    ], TrackingGradientDirective.prototype, "trackBackground");
    __decorate([
        core_1.HostListener('mousemove', ['$event'])
    ], TrackingGradientDirective.prototype, "onMouseMove");
    __decorate([
        core_1.HostListener('mouseenter')
    ], TrackingGradientDirective.prototype, "onMouseEnter");
    __decorate([
        core_1.HostListener('mouseleave')
    ], TrackingGradientDirective.prototype, "onMouseLeave");
    TrackingGradientDirective = __decorate([
        core_1.Directive({
            selector: '[tracking-gradient]'
        })
    ], TrackingGradientDirective);
    return TrackingGradientDirective;
}());
exports.TrackingGradientDirective = TrackingGradientDirective;
