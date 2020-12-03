"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DesignComponent = exports.AboutComponent = exports.DisclaimerComponent = exports.ToolbarComponent = void 0;
var core_1 = require("@angular/core");
var ToolbarComponent = /** @class */ (function () {
    function ToolbarComponent(fire, state, dialog) {
        var _this = this;
        this.fire = fire;
        this.state = state;
        this.dialog = dialog;
        this.sidenavActive = true;
        this.iconName = 'menu';
        this.loaded = false;
        state.windowWidth$.subscribe(function (screenSize) {
            _this.screenSize = screenSize;
        });
        this.state.sidenavStatus$.subscribe(function (isOpen) {
            _this.sidenavActive = isOpen;
        });
    }
    ToolbarComponent.prototype.ngOnInit = function () {
        this.animateHeader();
    };
    ToolbarComponent.prototype.animateHeader = function () {
        var _this = this;
        window.onscroll = function () {
            if (window.pageYOffset > 120) {
                _this.shrinkHeader = true;
            }
            else {
                _this.shrinkHeader = false;
            }
        };
    };
    ToolbarComponent.prototype.openDisclaimerDialog = function () {
        this.dialog.open(DisclaimerComponent, { width: '700px' });
    };
    ToolbarComponent.prototype.openAboutDialog = function () {
        this.dialog.open(AboutComponent, { width: '700px' });
    };
    ToolbarComponent.prototype.openDesignDialog = function () {
        this.dialog.open(DesignComponent, { width: '700px' });
    };
    __decorate([
        core_1.Input()
    ], ToolbarComponent.prototype, "loaded");
    ToolbarComponent = __decorate([
        core_1.Component({
            selector: 'app-toolbar',
            templateUrl: './toolbar.component.html',
            styleUrls: ['./toolbar.component.scss']
        })
    ], ToolbarComponent);
    return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;
var DisclaimerComponent = /** @class */ (function () {
    function DisclaimerComponent() {
    }
    DisclaimerComponent = __decorate([
        core_1.Component({
            selector: 'disclaimer-component',
            templateUrl: './disclaimer.html'
        })
    ], DisclaimerComponent);
    return DisclaimerComponent;
}());
exports.DisclaimerComponent = DisclaimerComponent;
var AboutComponent = /** @class */ (function () {
    function AboutComponent() {
    }
    AboutComponent = __decorate([
        core_1.Component({
            selector: 'about-component',
            templateUrl: './about.html'
        })
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
var DesignComponent = /** @class */ (function () {
    function DesignComponent() {
    }
    DesignComponent = __decorate([
        core_1.Component({
            selector: 'Design-component',
            templateUrl: './design.html'
        })
    ], DesignComponent);
    return DesignComponent;
}());
exports.DesignComponent = DesignComponent;
