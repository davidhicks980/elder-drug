"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavigationService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var NavigationService = /** @class */ (function () {
    function NavigationService(tableService, ruler) {
        var _this = this;
        this.tableService = tableService;
        this.isHidden = true;
        this.breakpoints = new Map();
        this.lowestBreakpoint = 5;
        this.itemWidth = 200;
        this.itemCount = 0;
        this.hiddenItemsListener = new rxjs_1.Subject();
        this.hiddenItemsCount = 0;
        this._showTabs = new rxjs_1.BehaviorSubject(true);
        this.tableProvider = rxjs_1.combineLatest([
            this.hiddenItemsListener,
            this.tableService.tableStatus$,
        ]).pipe(operators_1.tap(function (items) {
            _this.itemCount = items.length;
            _this.totalWidth = _this.itemCount * _this.itemWidth;
            _this._showTabs.next(ruler.getViewportSize().width > 600 || _this.itemCount === 0);
        }), operators_1.map(function (_a) {
            var hiddenCount = _a[0], items = _a[1];
            console.log(hiddenCount);
            return {
                hidden: items.slice(-hiddenCount - 1, -1),
                shown: items.slice(0, items.length - hiddenCount),
                all: items
            };
        }));
        this.currentTab = 0;
    }
    Object.defineProperty(NavigationService.prototype, "showTabs", {
        get: function () {
            return this._showTabs.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "shownTabs", {
        get: function () {
            return this.tableProvider.pipe(operators_1.pluck('shown'));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "allTabs", {
        get: function () {
            return this.tableProvider.pipe(operators_1.pluck('all'));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NavigationService.prototype, "width", {
        get: function () {
            return this.itemCount * 200 + 'px';
        },
        enumerable: false,
        configurable: true
    });
    NavigationService.prototype.createIntersectionObserver = function (elementRef) {
        var _this = this;
        var options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        };
        var observerFunction = function (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var entry = entries_1[_i];
                _this.coveredWidth = entry.intersectionRect.right;
                _this.hiddenItemsCount = Math.floor((_this.itemCount * 200 - _this.coveredWidth) / 200);
                Math.sign(_this.hiddenItemsCount) != -1
                    ? _this.hiddenItemsListener.next(_this.hiddenItemsCount + 1)
                    : _this.hiddenItemsListener.next(0);
            }
        };
        var observer = new IntersectionObserver(observerFunction, options);
        observer.observe(elementRef);
    };
    Object.defineProperty(NavigationService.prototype, "hiddenTabs", {
        get: function () {
            return this.tableProvider.pipe(operators_1.pluck('hidden'), operators_1.tap(function (item) { return console.log(item); }));
        },
        enumerable: false,
        configurable: true
    });
    NavigationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], NavigationService);
    return NavigationService;
}());
exports.NavigationService = NavigationService;
