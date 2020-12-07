"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavigationComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var animations_2 = require("../animations");
var websocket_service_1 = require("../websocket.service");
var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(webSocketService, state, iconRegistry, sanitizer) {
        var _this = this;
        this.webSocketService = webSocketService;
        this.state = state;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.tablesLoaded = false;
        this.layout = this.state.layoutStatus;
        this.sidenavOpen = true;
        this.state.windowWidth$.subscribe(function (layoutStatus) {
            _this.layout = layoutStatus;
            _this.sidenavOpen = _this.layout.sidenavOpen;
        });
        iconRegistry.addSvgIcon('chevron_right', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_right.svg'));
        iconRegistry.addSvgIcon('chevron_left', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/chevron_left.svg'));
        iconRegistry.addSvgIcon('menu', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu.svg'));
    }
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
                animations_2.slideInLeft,
                animations_2.dropInAnimation,
                animations_2.slidingSidenavAnimation,
                animations_2.tableVisibleAnimation,
                animations_2.mobileSidenavAnimation,
                animations_2.logoSlideAnimation,
                animations_2.slidingContentAnimation,
                animations_1.trigger('sidenavExpand', [
                    animations_1.state('closed', animations_1.style({ transform: 'translateX(0px)' })),
                    animations_1.state('open', animations_1.style({ transform: 'translateX(0px)' })),
                    animations_1.transition('open => closed', animations_1.group([
                        animations_1.animate('200ms ease', animations_1.keyframes([animations_1.style({ transform: 'translateX(-285px)', offset: 1 })])),
                    ])),
                    animations_1.transition('closed => open', animations_1.animate('400ms ease', animations_1.keyframes([
                        animations_1.style({ transform: 'translateX(-285px)', offset: 0 }),
                        animations_1.style({ transform: 'translateX(0px)', offset: 1 }),
                    ]))),
                    animations_1.transition(':enter', [
                        animations_1.style({
                            transform: 'translateX(-285px)'
                        }),
                        animations_1.animate('400ms ease', animations_1.style({ transform: 'translate(0px)' })),
                    ]),
                    animations_1.transition(':leave', [
                        animations_1.style({
                            transform: 'translateX(0px)'
                        }),
                        animations_1.animate('200ms ease', animations_1.style({
                            transform: 'translateX(-285px)'
                        })),
                    ]),
                ]),
            ]
        })
    ], NavigationComponent);
    return NavigationComponent;
}());
exports.NavigationComponent = NavigationComponent;
