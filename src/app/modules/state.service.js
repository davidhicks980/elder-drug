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
var ReplaySubject_1 = require("rxjs/internal/ReplaySubject");
var ScreenStatus;
(function (ScreenStatus) {
    ScreenStatus[ScreenStatus["xSmall"] = 1] = "xSmall";
    ScreenStatus[ScreenStatus["small"] = 2] = "small";
    ScreenStatus[ScreenStatus["large"] = 3] = "large";
})(ScreenStatus = exports.ScreenStatus || (exports.ScreenStatus = {}));
var StateService = /** @class */ (function () {
    function StateService(_ruler) {
        var _this = this;
        this.sidenavOpen = true;
        this.windowWidthSource = new ReplaySubject_1.ReplaySubject();
        this.windowWidth$ = this.windowWidthSource.asObservable();
        this.smallContentSource = new ReplaySubject_1.ReplaySubject();
        this.smallContent$ = this.smallContentSource.asObservable();
        this.width = ScreenStatus.large;
        this.sidenavStatus$ = this.windowWidthSource.asObservable();
        this.activeTables = [];
        this.mobileWidth = false;
        this.requestPropertySource = new rxjs_1.Subject();
        this.sendPropertySource = new rxjs_1.Subject();
        // Observable string streams
        this.name = 'StateService';
        try {
            _ruler.change(8).subscribe(function () {
                var layoutType = 0;
                if (_ruler.getViewportSize().width < 600) {
                    _this.mobileWidth = true;
                    _this.width = ScreenStatus.xSmall;
                    layoutType = 1 * (Number(_this.sidenavOpen) + 1);
                }
                else if (_ruler.getViewportSize().width < 960) {
                    _this.width = ScreenStatus.small;
                    _this.mobileWidth = false;
                    layoutType = 2 * (Number(_this.sidenavOpen) + 1);
                }
                else {
                    _this.width = ScreenStatus.large;
                    _this.mobileWidth = false;
                    layoutType = 3 * (Number(_this.sidenavOpen) + 1);
                }
                if (_this.layoutType !== layoutType) {
                    _this.layoutType = layoutType;
                    _this.windowWidthSource.next({
                        sidenavOpen: _this.sidenavOpen,
                        screenWidth: _this.width,
                        mobileWidth: _this.mobileWidth
                    });
                }
            });
        }
        catch (err) {
            console.log(err);
        }
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
    StateService.prototype.emitContentWidthStatus = function (contentIsSmall) {
        this.smallContentSource.next(contentIsSmall);
    };
    StateService.prototype.toggleSidenav = function () {
        this.sidenavOpen = !this.sidenavOpen;
        this.windowWidthSource.next({
            sidenavOpen: this.sidenavOpen,
            screenWidth: this.width,
            mobileWidth: this.mobileWidth
        });
    };
    StateService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], StateService);
    return StateService;
}());
exports.StateService = StateService;
