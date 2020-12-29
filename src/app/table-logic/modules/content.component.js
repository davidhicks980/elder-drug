"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ContentComponent = void 0;
var animations_1 = require("@angular/animations");
var scrolling_1 = require("@angular/cdk/scrolling");
var core_1 = require("@angular/core");
var resize_observer_1 = require("@juggle/resize-observer");
var ReplaySubject_1 = require("rxjs/internal/ReplaySubject");
var ContentComponent = /** @class */ (function () {
    function ContentComponent(firestore, state, tableService, cdr) {
        var _this = this;
        this.firestore = firestore;
        this.state = state;
        this.tableService = tableService;
        this.cdr = cdr;
        this.loaded = false;
        this.smallContent = new ReplaySubject_1.ReplaySubject();
        this.observedSmallContent = this.smallContent.asObservable();
        this.mobileContent = true;
        this.state = state;
        this.tableService.tableStatus$.subscribe(function (active) {
            _this.enabledTables = active;
            if (!_this.loaded) {
                _this.loaded = true;
            }
        });
    }
    ContentComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var check;
        var width;
        this.observer = new resize_observer_1.ResizeObserver(function (entries, observer) {
            if (_this.content) {
                check = _this.mobileContent;
                width = entries[0].borderBoxSize[0].inlineSize;
                _this.expansionPanelWidth = width - 220;
                _this.contentWidth = width - 20 + 'px';
                _this.mobileContent = width < 600;
                if (_this.mobileContent != check) {
                    _this.state.emitContentWidthStatus(_this.mobileContent);
                }
            }
        });
        this.observer.observe(this.content.nativeElement);
    };
    __decorate([
        core_1.ViewChild('content')
    ], ContentComponent.prototype, "content");
    __decorate([
        core_1.ViewChild(scrolling_1.CdkVirtualScrollViewport)
    ], ContentComponent.prototype, "viewport");
    ContentComponent = __decorate([
        core_1.Component({
            selector: 'app-content',
            template: "\n    <div\n      #content\n      [fxLayout]=\"mobileContent ? 'column-reverse' : 'row'\"\n      [@fadeIn]=\"loaded\"\n      [class]=\"\n        mobileContent\n          ? 'mobile-height table-viewport'\n          : 'desktop-height table-viewport'\n      \"\n    >\n      <ng-container *ngIf=\"loaded\">\n        <div fxFlex=\"auto\">\n          <br />\n          <ng-container *ngFor=\"let table of enabledTables\">\n            <div fxLayout=\"column\" fxLayoutAlign=\"start center\">\n              <mat-expansion-panel\n                aria-label=\"expand this panel to see drugs that match your search\"\n                class=\"expansion-margin soft-shadow\"\n                matExpansionPanelContent\n                [style.width]=\"\n                  mobileContent\n                    ? this.contentWidth\n                    : this.expansionPanelWidth + 'px'\n                \"\n                [style.maxWidth]=\"this.contentWidth\"\n              >\n                <mat-expansion-panel-header class=\"accordion-header\">{{\n                  table | toString\n                }}</mat-expansion-panel-header>\n\n                <app-table [tableName]=\"table\"> </app-table>\n              </mat-expansion-panel>\n              <br />\n            </div>\n          </ng-container>\n        </div>\n        <div [fxFlex]=\"mobileContent ? '120px' : '200px'\" fxLayout=\"column\">\n          <modify-table-panel></modify-table-panel>\n        </div>\n      </ng-container>\n    </div>\n  ",
            styleUrls: ['./content.component.scss'],
            animations: [
                animations_1.trigger('fadeIn', [
                    animations_1.transition(':enter', [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('2s', animations_1.style({ opacity: 1 })),
                    ]),
                    animations_1.transition(':leave', [animations_1.animate('2s', animations_1.style({ opacity: 0 }))]),
                ]),
            ]
        })
    ], ContentComponent);
    return ContentComponent;
}());
exports.ContentComponent = ContentComponent;
