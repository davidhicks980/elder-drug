"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavigationComponent = void 0;
var core_1 = require("@angular/core");
var websocket_service_1 = require("../websocket.service");
var state_service_1 = require("../state.service");
var animations_1 = require("../animations");
var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(webSocketService, state, iconRegistry, sanitizer) {
        var _this = this;
        this.webSocketService = webSocketService;
        this.state = state;
        this.sanitizer = sanitizer;
        this.sidenavActive = true;
        this.tablesLoaded = false;
        this.state.windowWidth$.subscribe(function (screenSize) {
            _this.screenSize = screenSize;
        });
        this.state.sidenavStatus$.subscribe(function (status) {
            _this.sidenavActive = status;
        });
        iconRegistry.addSvgIcon('chevron_right', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_right.svg'));
        iconRegistry.addSvgIcon('chevron_left', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_left.svg'));
        iconRegistry.addSvgIcon('menu', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg'));
    }
    NavigationComponent.prototype.ngAfterViewInit = function () {
        if (this.state.breakpointObserver.isMatched('(max-width: 599.99px)')) {
            this.breakpointWidth = state_service_1.ScreenWidth.xSmall;
        }
        else if (this.state.breakpointObserver.isMatched('(min-width: 600px) and (max-width: 959.99px)')) {
            this.breakpointWidth = state_service_1.ScreenWidth.small;
        }
        else {
            this.breakpointWidth = state_service_1.ScreenWidth.large;
        }
        this.state.windowWidthSource.next(this.breakpointWidth);
    };
    __decorate([
        core_1.ViewChild('leftdrawer')
    ], NavigationComponent.prototype, "sidenav");
    NavigationComponent = __decorate([
        core_1.Component({
            selector: 'app-navigation',
            templateUrl: './navigation.component.html',
            styleUrls: ['./navigation.component.scss'],
            providers: [websocket_service_1.WebsocketService],
            animations: [
                animations_1.slideInLeft,
                animations_1.dropInAnimation,
                animations_1.formVisibleAnimation,
                animations_1.tableVisibleAnimation,
                animations_1.mobileSidenavAnimation,
                animations_1.logoSlideAnimation,
            ]
        })
    ], NavigationComponent);
    return NavigationComponent;
}());
exports.NavigationComponent = NavigationComponent;
