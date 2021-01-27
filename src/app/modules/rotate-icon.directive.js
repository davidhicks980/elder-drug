"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RotateDirective = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var RotateDirective = /** @class */ (function () {
    function RotateDirective(el, animationBuilder) {
        this.el = el;
        this.previousRotate = false;
        this.rotate = false;
        this.animationBuilder = animationBuilder;
    }
    Object.defineProperty(RotateDirective.prototype, "rotate", {
        get: function () {
            return this._rotate;
        },
        set: function (rotate) {
            this.createPlayer(rotate);
        },
        enumerable: false,
        configurable: true
    });
    RotateDirective.prototype.createPlayer = function (attachment) {
        if (this.player) {
            this.player.destroy();
        }
        var animationFactory;
        if (true) {
            animationFactory = this.animationBuilder.build([
                animations_1.style({ transform: 'rotate(0deg)' }),
                animations_1.animate(200, animations_1.style({ transform: 'rotate(90deg)' })),
            ]);
        }
        else {
            animationFactory = this.animationBuilder.build([
                animations_1.style({ transform: 'rotate(90deg)' }),
                animations_1.animate(200, animations_1.style({ transform: 'rotate(0deg)' })),
            ]);
        }
        this.player = animationFactory.create(attachment);
        this.player.play();
    };
    RotateDirective.prototype.ngOnInit = function () {
        this.el.nativeElement.style.transition = 'all 0.5s ease';
    };
    __decorate([
        core_1.Input()
    ], RotateDirective.prototype, "rotate");
    RotateDirective = __decorate([
        core_1.Directive({
            selector: '[rotateIcon]'
        })
    ], RotateDirective);
    return RotateDirective;
}());
exports.RotateDirective = RotateDirective;
