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
var animations_1 = require("../../../animations");
var ToolbarComponent = /** @class */ (function () {
    function ToolbarComponent(fire, state, dialog) {
        var _this = this;
        this.fire = fire;
        this.state = state;
        this.dialog = dialog;
        this.iconName = 'menu';
        this.loaded = false;
        this.state.windowWidth$.subscribe(function (layoutStatus) {
            _this.layout = layoutStatus;
        });
    }
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
            selector: 'elder-toolbar',
            templateUrl: './toolbar.component.html',
            styleUrls: ['./toolbar.component.scss'],
            animations: [animations_1.toolbarItemsFade]
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
