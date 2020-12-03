"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EmptyInputComponent = exports.EnterDrugFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var input_1 = require("@angular/material/input");
var autocomplete_1 = require("@angular/material/autocomplete");
var animations_1 = require("../../animations");
var EnterDrugFormComponent = /** @class */ (function () {
    function EnterDrugFormComponent(stateService, fire, fb, dialog, iconRegistry, sanitizer) {
        this.stateService = stateService;
        this.fire = fire;
        this.fb = fb;
        this.dialog = dialog;
        this.iconRegistry = iconRegistry;
        this.sanitizer = sanitizer;
        this.drugsGroup = this.fb.group({
            drugs: this.fb.array([
                this.fb.control('', [
                    forms_1.Validators.pattern('[a-zA-Z ]*'),
                    forms_1.Validators.minLength(2),
                    forms_1.Validators.maxLength(70),
                ]),
            ])
        });
        this.activeInput = 0;
        this.sideOpen = this.stateService.sidenavOpen;
        iconRegistry.addSvgIcon('add-circle-outline.svg', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add_circle_outline.svg'));
        iconRegistry.addSvgIcon('delete.svg', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg'));
    }
    EnterDrugFormComponent.prototype.boldDropdownText = function (option, active) {
        var index = option.search(active);
        var subString = option.substring(index, index + 50);
        return '<p>' + subString.replace(active, active.bold()) + '</p>';
    };
    EnterDrugFormComponent.prototype.name = function (i) {
        return this.drugs.at(i);
    };
    Object.defineProperty(EnterDrugFormComponent.prototype, "drugs", {
        get: function () {
            return this.drugsGroup.get('drugs');
        },
        enumerable: false,
        configurable: true
    });
    EnterDrugFormComponent.prototype.search = function () {
        var _this = this;
        var out = [];
        var index = 0;
        this.drugs.value.filter(function (drug) {
            _this.fire.entryMap.has(drug.toLowerCase())
                ? out.push(drug)
                : _this.drugs.controls[index].setErrors({
                    notDrug: true
                });
            index++;
        });
        if (out.length > 0) {
            this.fire.searchDrugs(out);
            this.stateService.toggleSidenav();
        }
        else {
            this.openDialog();
        }
    };
    EnterDrugFormComponent.prototype.stopPropagation = function () {
        event.stopPropagation();
    };
    EnterDrugFormComponent.prototype.addDrug = function () {
        if (this.drugs.length < 8) {
            this.drugs.push(this.fb.control('', [
                forms_1.Validators.pattern('[a-zA-Z ]*'),
                forms_1.Validators.minLength(2),
                forms_1.Validators.maxLength(70),
            ]));
        }
    };
    EnterDrugFormComponent.prototype.ngOnInit = function () {
        this.sidenavActive = this.stateService.sidenavOpen;
        this.stateService.toggleSidenav();
    };
    EnterDrugFormComponent.prototype.deleteFormControl = function (index) {
        this.drugs.removeAt(index);
    };
    EnterDrugFormComponent.prototype.getDropdownItems = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(input.length > 1)) return [3 /*break*/, 2];
                        this.entryValue = input;
                        return [4 /*yield*/, this.fire.filterValues(input)];
                    case 1:
                        filteredOptions = _a.sent();
                        if (filteredOptions) {
                            this.dropdownItems = filteredOptions.slice(0, 5);
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    EnterDrugFormComponent.prototype.openDialog = function () {
        this.dialog.open(EmptyInputComponent, { width: '20em' });
    };
    __decorate([
        core_1.ViewChildren(autocomplete_1.MatAutocompleteTrigger)
    ], EnterDrugFormComponent.prototype, "trigger");
    __decorate([
        core_1.ViewChildren(input_1.MatInput)
    ], EnterDrugFormComponent.prototype, "submission");
    __decorate([
        core_1.ViewChild('drawer')
    ], EnterDrugFormComponent.prototype, "sidenav");
    EnterDrugFormComponent = __decorate([
        core_1.Component({
            selector: 'app-enter-drug-form',
            templateUrl: './enter-drug-form.component.html',
            styleUrls: ['./enter-drug-form.component.scss'],
            animations: [animations_1.inputAnimation]
        })
    ], EnterDrugFormComponent);
    return EnterDrugFormComponent;
}());
exports.EnterDrugFormComponent = EnterDrugFormComponent;
var EmptyInputComponent = /** @class */ (function () {
    function EmptyInputComponent() {
    }
    EmptyInputComponent = __decorate([
        core_1.Component({
            selector: 'empty-input-dialog-component',
            templateUrl: 'empty-input.html'
        })
    ], EmptyInputComponent);
    return EmptyInputComponent;
}());
exports.EmptyInputComponent = EmptyInputComponent;
