"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LogoComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var LogoComponent = /** @class */ (function () {
    function LogoComponent(stateService) {
        var _this = this;
        this.stateService = stateService;
        // show defines whether the logo should be shown
        // alt defines whether the alternative palette should be used
        this.altColor = false;
        this.title = false;
        this.showLogo = true;
        this.contentPlaceholder = false;
        this.stateService.windowWidth$.subscribe(function (screenSize) {
            _this.screenSize = screenSize;
            _this.checkLogoStatus();
        });
        stateService.sidenavStatus$.subscribe(function (isOpen) {
            _this.drawerOpened = isOpen;
            _this.checkLogoStatus();
        });
    }
    LogoComponent.prototype.checkLogoStatus = function () {
        if (!this.title) {
            if (this.screenSize != 'LARGE' || !this.drawerOpened) {
                this.showLogo = true;
            }
            else {
                this.showLogo = false;
            }
        }
    };
    __decorate([
        core_1.Input()
    ], LogoComponent.prototype, "altColor");
    __decorate([
        core_1.Input()
    ], LogoComponent.prototype, "title");
    __decorate([
        core_1.Input()
    ], LogoComponent.prototype, "contentPlaceholder");
    LogoComponent = __decorate([
        core_1.Component({
            selector: 'app-logo',
            templateUrl: './logo-component.html',
            styleUrls: ['./logo.component.scss'],
            animations: [
                animations_1.trigger('openClose', [
                    animations_1.transition(':leave', [
                        animations_1.style({
                            width: '3.5em',
                            opacity: 1
                        }),
                        animations_1.animate('0.3s ease-out', animations_1.style({
                            opacity: 0,
                            width: '0em'
                        })),
                    ]),
                ]),
            ]
        })
    ], LogoComponent);
    return LogoComponent;
}());
exports.LogoComponent = LogoComponent;
