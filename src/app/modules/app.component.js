"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent(state, iconRegistry, sanitizer, firebase) {
        this.state = state;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.firebase = firebase;
        this.title = 'ElderDrug';
        this.firebase = firebase;
        iconRegistry.addSvgIcon('search', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/search.svg'));
        this.iconRegistry.addSvgIcon('add--outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ion-add-circle-outline.svg'));
        this.iconRegistry.addSvgIcon('delete', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ion-trash.svg'));
        iconRegistry.addSvgIcon('error', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/error.svg'));
        iconRegistry.addSvgIcon('unfold_less', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_less.svg'));
        iconRegistry.addSvgIcon('remove_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/remove_circle_outline.svg'));
        iconRegistry.addSvgIcon('add_circle_outline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_circle_outline.svg'));
        iconRegistry.addSvgIcon('unfold_more', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/unfold_more.svg'));
        iconRegistry.addSvgIcon('expand_less', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/expand_less.svg'));
        iconRegistry.addSvgIcon('chevron_right', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_right.svg'));
        iconRegistry.addSvgIcon('chevron_left', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_left.svg'));
        iconRegistry.addSvgIcon('arrow_right', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow_right.svg'));
        iconRegistry.addSvgIcon('menu', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg'));
        iconRegistry.addSvgIcon('heart-ekg', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/heart-ekg.svg'));
        iconRegistry.addSvgIcon('chevron_down', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_down.svg'));
        iconRegistry.addSvgIcon('kidneys', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/kidneys.svg'));
        iconRegistry.addSvgIcon('capsule', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/capsule.svg'));
        iconRegistry.addSvgIcon('general-health', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/general-health.svg'));
        iconRegistry.addSvgIcon('elder_drug_logo', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/elder_drug_logo.svg'));
        iconRegistry
            .addSvgIcon('scale', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/scale.svg'));
    }
    AppComponent.prototype.ngOnInit = function () { };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html'
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
