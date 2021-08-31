"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.ExpansionPanelComponent = void 0;

var animations_1 = require("@angular/animations");

var accordion_1 = require("@angular/cdk/accordion");

var core_1 = require("@angular/core");

var expansion_1 = require("@angular/material/expansion");

var ExpansionPanelComponent =
/** @class */
function (_super) {
  __extends(ExpansionPanelComponent, _super);

  function ExpansionPanelComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ExpansionPanelComponent.prototype.ngOnInit = function () {};

  ExpansionPanelComponent.prototype.getExpandedState = function () {
    return this.expanded ? "expanded" : "collapsed";
  };

  ExpansionPanelComponent = __decorate([core_1.Component({
    selector: "elder-expansion-panel",
    templateUrl: "./expansion-panel.component.html",
    styleUrls: ["./expansion-panel.component.scss"],
    animations: [expansion_1.matExpansionAnimations.bodyExpansion, expansion_1.matExpansionAnimations.indicatorRotate, animations_1.trigger("revealContentText", [animations_1.state("expanded", animations_1.style({
      opacity: 0
    })), animations_1.state("collapsed", animations_1.style({
      opacity: 1
    })), animations_1.transition("expanded <=> collapsed", animations_1.animate("200ms ease"))])]
  })], ExpansionPanelComponent);
  return ExpansionPanelComponent;
}(accordion_1.CdkAccordionItem);

exports.ExpansionPanelComponent = ExpansionPanelComponent;