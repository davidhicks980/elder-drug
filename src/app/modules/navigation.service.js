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
    function NavigationService(columnService, tableService) {
        var _this = this;
        this.columnService = columnService;
        this.tableService = tableService;
        this.isHidden = true;
        this.breakpoints = new Map();
        this.lowestBreakpoint = 5;
        this.itemWidth = 200;
        this.hiddenItemsListener = new rxjs_1.Subject();
        this.hiddenItemsCount = 0;
        this.loaded = false;
        var tableProvider = rxjs_1.combineLatest([
            this.hiddenItemsListener,
            this.tableService.tableStatus$,
        ]).pipe(operators_1.map(function (_a) {
            var hiddenCount = _a[0], items = _a[1];
            return {
                hidden: items.slice(-hiddenCount - 1, -1),
                shown: items.slice(0, items.length - hiddenCount)
            };
        }));
        this.items = this.tableService.tableStatus$
            .pipe(operators_1.tap(function (items) {
            _this.itemCount = items.length;
            _this.totalWidth = _this.itemCount * _this.itemWidth;
        }))
            .subscribe(function () { });
        this.shownTabs = tableProvider.pipe(operators_1.pluck('shown'));
        this.hiddenTabs = tableProvider.pipe(operators_1.pluck('hidden'), operators_1.tap(function (item) { return console.log(item); }));
        this.currentTab = 0;
    }
    Object.defineProperty(NavigationService.prototype, "width", {
        get: function () {
            return this.itemCount * 200 + 'px';
        },
        enumerable: false,
        configurable: true
    });
    NavigationService.prototype._observerFunction = function (entries) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            this.coveredWidth = entry.intersectionRect.right;
            this.hiddenItemsCount = Math.floor((this.totalWidth - this.coveredWidth) / this.itemWidth);
            Math.sign(this.hiddenItemsCount) != -1
                ? this.hiddenItemsListener.next(this.hiddenItemsCount + 1)
                : this.hiddenItemsListener.next(0);
        }
    };
    NavigationService.prototype.createIntersectionObserver = function (elementRef) {
        var options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        };
        var observer = new IntersectionObserver(this._observerFunction, options);
        observer.observe(elementRef);
    };
    NavigationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], NavigationService);
    return NavigationService;
}());
exports.NavigationService = NavigationService;
