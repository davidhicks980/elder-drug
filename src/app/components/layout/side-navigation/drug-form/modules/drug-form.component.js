"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmptyInputComponent = exports.DrugFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var autocomplete_1 = require("@angular/material/autocomplete");
var input_1 = require("@angular/material/input");
var operators_1 = require("rxjs/operators");
var animations_1 = require("../../../../animations");
var DrugFormComponent = /** @class */ (function () {
    function DrugFormComponent(state, fire, fb, dialog) {
        var _this = this;
        this.state = state;
        this.fire = fire;
        this.fb = fb;
        this.dialog = dialog;
        this.drugsGroup = this.fb.group({
            drugs: new forms_1.FormControl('', [
                forms_1.Validators.pattern('[a-zA-Z0-9 -]*'),
                forms_1.Validators.minLength(2),
                forms_1.Validators.maxLength(70),
            ]),
            chips: new forms_1.FormControl([])
        });
        this.activeInput = 0;
        this.visible = true;
        this.selectable = true;
        this.removable = true;
        this.addOnBlur = true;
        /* const index = option.search(active);
        const subString = option.substring(index, index + 50);
        return '<p>' + subString.replace(active, active.bold()) + '</p>';*/
        this.drugs.valueChanges.pipe(operators_1.debounceTime(30)).subscribe(function (res) {
            fire.filterValues(res);
        });
        this.dropdownItems = fire.filteredItems$;
        this.state.windowWidth$.subscribe(function (layoutStatus) {
            _this.layout = layoutStatus;
        });
    }
    DrugFormComponent.prototype.boldInputText = function (option, active) {
        var index = option.search(active);
        var subString = option.substring(index, index + 50);
        return '<p>' + subString.replace(active, active.bold()) + '</p>';
    };
    Object.defineProperty(DrugFormComponent.prototype, "chips", {
        get: function () {
            return this.drugsGroup.get('chips');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DrugFormComponent.prototype, "drugs", {
        get: function () {
            return this.drugsGroup.get('drugs');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DrugFormComponent.prototype, "inputLength", {
        get: function () {
            return this.drugs.value.length;
        },
        enumerable: false,
        configurable: true
    });
    DrugFormComponent.prototype.search = function () {
        var _this = this;
        var out = [];
        var index = 0;
        this.drugs.value.filter(function (drug) {
            _this.fire.entryMap.has(drug.toLowerCase())
                ? out.push(drug)
                : _this.drugs.setErrors({
                    notDrug: true
                });
            index++;
        });
        if (out.length > 0) {
            this.fire.searchDrugs(out);
            this.state.toggleSidenav();
        }
        else {
            this.openDialog();
        }
    };
    DrugFormComponent.prototype.stopPropagation = function () {
        event.stopPropagation();
    };
    Object.defineProperty(DrugFormComponent.prototype, "activeInputIndex", {
        set: function (index) {
            this._activeInputIndex = index;
        },
        enumerable: false,
        configurable: true
    });
    DrugFormComponent.prototype.checkForDrug = function (drug) {
        return this.fire.isPresent(drug);
    };
    DrugFormComponent.prototype.chooseOption = function (optionValue) {
        if (this.fire.isPresent(optionValue)) {
            this.drugs.setValue(optionValue);
            this.addInput();
        }
    };
    DrugFormComponent.prototype.addInput = function () {
        var _this = this;
        if (this.chips.value.length < 8) {
            this.chips.value.push(this.drugs.value);
            setTimeout(function () { return _this.drugs.setValue(''); }, 30);
        }
    };
    DrugFormComponent.prototype.editOptionAt = function (index) {
        this.drugs.setValue(this.removeOptionAt(index));
    };
    DrugFormComponent.prototype.removeOptionAt = function (index) {
        return this.chips.value.splice(index, 1);
    };
    DrugFormComponent.prototype.openDialog = function () {
        this.dialog.open(EmptyInputComponent, { width: '20em' });
    };
    __decorate([
        core_1.ViewChildren(autocomplete_1.MatAutocompleteTrigger)
    ], DrugFormComponent.prototype, "trigger");
    __decorate([
        core_1.ViewChildren(input_1.MatInput)
    ], DrugFormComponent.prototype, "submission");
    __decorate([
        core_1.ViewChild('drawer')
    ], DrugFormComponent.prototype, "sidenav");
    DrugFormComponent = __decorate([
        core_1.Component({
            selector: 'elder-drug-form',
            templateUrl: './drug-form.component.html',
            styleUrls: ['./drug-form.component.scss'],
            animations: [animations_1.inputAnimation],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], DrugFormComponent);
    return DrugFormComponent;
}());
exports.DrugFormComponent = DrugFormComponent;
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
