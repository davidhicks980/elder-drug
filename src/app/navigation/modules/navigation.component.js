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
var firebase_service_1 = require("../firebase.service");
var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(webSocketService, state, tableService) {
        var _this = this;
        this.webSocketService = webSocketService;
        this.state = state;
        this.tableService = tableService;
        this.tablesLoaded = false;
        this.layout = this.state.layoutStatus;
        this.sidenavOpen = true;
        this.state.windowWidth$.subscribe(function (layoutStatus) {
            _this.layout = layoutStatus;
            _this.mobileWidth = _this.layout.mobileWidth;
            _this.sidenavOpen = _this.layout.sidenavOpen;
        });
        this.tableService.tableStatus$.subscribe(function (active) {
            _this.enabledTables = active.map(function (table) {
                return tableService.tables.filter(function (tab) { return tab.TableNumber === table; })[0];
            });
        });
    }
    NavigationComponent.prototype.ngAfterViewInit = function () { };
    NavigationComponent = __decorate([
        core_1.Component({
            selector: 'app-navigation',
            templateUrl: './navigation.component.html',
            styleUrls: ['./navigation.component.scss'],
            providers: [firebase_service_1.FirebaseService],
            animations: [
                animations_2.slideInLeft,
                animations_2.dropInAnimation,
                animations_2.tableVisibleAnimation,
                animations_2.mobileSlidingSidenavAnimation,
                animations_2.logoSlideAnimation,
                animations_2.slidingContentAnimation,
                animations_1.trigger('arrowSlideLeft', [
                    animations_1.transition(':enter', [
                        animations_1.style({
                            opacity: 0,
                            transform: 'translateX(200px)'
                        }),
                        animations_1.animate('300ms ease', animations_1.style({ opacity: 1, transform: 'translate(0px)' })),
                    ]),
                ]),
                animations_1.trigger('sidenavExpand', [
                    animations_1.state('close', animations_1.style({ transform: 'translateX(0px)' })),
                    animations_1.state('open', animations_1.style({ transform: 'translateX(0px)' })),
                    animations_1.state('mobileClose', animations_1.style({ transform: 'translateX(0px)' })),
                    animations_1.state('mobileOpen', animations_1.style({ transform: 'translateX(0px)' })),
                    animations_1.transition('mobileOpen => mobileClose', animations_1.group([
                        animations_1.animate('200ms ease', animations_1.keyframes([animations_1.style({ transform: 'translateX(-500px)', offset: 1 })])),
                    ])),
                    animations_1.transition('mobileClose => mobileOpen', animations_1.animate('400ms ease', animations_1.keyframes([
                        animations_1.style({ transform: 'translateX(-500px)', offset: 0 }),
                        animations_1.style({ transform: 'translateX(0px)', offset: 1 }),
                    ]))),
                    animations_1.transition('open => close', animations_1.group([
                        animations_1.animate('200ms ease', animations_1.keyframes([animations_1.style({ transform: 'translateX(-285px)', offset: 1 })])),
                    ])),
                    animations_1.transition('close => open', animations_1.animate('400ms ease', animations_1.keyframes([
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
