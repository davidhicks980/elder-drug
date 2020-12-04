"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StateService = exports.ScreenStatus = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var layout_1 = require("@angular/cdk/layout");
var ScreenStatus;
(function (ScreenStatus) {
    ScreenStatus[ScreenStatus["xSmall"] = 1] = "xSmall";
    ScreenStatus[ScreenStatus["small"] = 2] = "small";
    ScreenStatus[ScreenStatus["large"] = 3] = "large";
})(ScreenStatus = exports.ScreenStatus || (exports.ScreenStatus = {}));
var StateService = /** @class */ (function () {
    function StateService(breakpointObserver) {
        var _this = this;
        this.breakpointObserver = breakpointObserver;
        this.windowWidthSource = new rxjs_1.Subject();
        this.windowWidth$ = this.windowWidthSource.asObservable();
        this.sidenavStatus$ = this.windowWidthSource.asObservable();
        this.tableStatusSource = new rxjs_1.Subject();
        this.tableStatus$ = this.tableStatusSource.asObservable();
        this.requestPropertySource = new rxjs_1.Subject();
        this.sendPropertySource = new rxjs_1.Subject();
        // Observable string streams
        this.receivedRequestedProperties$ = this.requestPropertySource.asObservable();
        this.sentPropertyResponse$ = this.sendPropertySource.asObservable();
        this.name = 'StateService';
        this.breakpointObserver
            .observe([layout_1.Breakpoints.Small, layout_1.Breakpoints.XSmall])
            .subscribe(function (state) {
            if (state.breakpoints['(max-width: 599.99px)']) {
                _this.width = ScreenStatus.xSmall;
                _this.mobileWidth = true;
            }
            else if (state.breakpoints['(min-width: 600px) and (max-width: 959.99px)']) {
                _this.width = ScreenStatus.small;
                _this.mobileWidth = false;
            }
            else {
                _this.width = ScreenStatus.large;
                _this.mobileWidth = false;
            }
            _this.windowWidthSource.next({
                sidenavOpen: _this.sidenavOpen,
                screenWidth: _this.width,
                mobileWidth: _this.mobileWidth
            });
        });
        this.tableStatus$.subscribe(function (active) {
            _this.activeTables = active;
        });
    }
    Object.defineProperty(StateService.prototype, "layoutStatus", {
        get: function () {
            return {
                sidenavOpen: this.sidenavOpen,
                screenWidth: this.width,
                mobileWidth: this.mobileWidth
            };
        },
        enumerable: false,
        configurable: true
    });
    // Service message commands
    StateService.prototype.requestComponentProperty = function (sourceComponent, targetComponent, targetProperty) {
        if (targetComponent === this.name) {
            console.log('sending native property');
            this.sendComponentProperty('howdy');
        }
        else {
            this.requestPropertySource.next({
                source: sourceComponent,
                target: targetComponent,
                property: targetProperty
            });
        }
    };
    StateService.prototype.sendComponentProperty = function (propertyValue) {
        this.sendPropertySource.next(propertyValue);
        console.log("sent " + propertyValue);
    };
    StateService.prototype.toggleSidenav = function () {
        this.sidenavOpen = !this.sidenavOpen;
        this.windowWidthSource.next({
            sidenavOpen: this.sidenavOpen,
            screenWidth: this.width,
            mobileWidth: this.mobileWidth
        });
    };
    StateService.prototype.emitSelectedTables = function (selections) {
        this.tableStatusSource.next(selections);
    };
    StateService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], StateService);
    return StateService;
}());
exports.StateService = StateService;
