"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TableService = void 0;
var core_1 = require("@angular/core");
var ReplaySubject_1 = require("rxjs/internal/ReplaySubject");
var TableService = /** @class */ (function () {
    function TableService() {
        this.tableStatusSource = new ReplaySubject_1.ReplaySubject(3);
        this.tableStatus$ = this.tableStatusSource.asObservable();
        this._tables = [
            {
                TableNumber: 2,
                TableDefinition: 'Potentially Inappropriate Medication Use in Older Adults ',
                ShortName: 'Potentially Innappropriate',
                Identifier: 'PotenInappropriate'
            },
            {
                TableNumber: 3,
                TableDefinition: 'Potentially Inappropriate Medication Use in Older Adults Due to Drug-Disease or Drug-Syndrome Interactions That May Exacerbate the Disease or Syndrome',
                ShortName: 'Disease-Specific',
                Identifier: 'DiseaseGuidance'
            },
            {
                TableNumber: 4,
                TableDefinition: 'Drugs To Be Used With Caution in Older Adults',
                ShortName: 'Use with Caution',
                Identifier: 'Caution'
            },
            {
                TableNumber: 5,
                TableDefinition: 'Potentially Clinically Important Drug-Drug Interactions That Should Be Avoided in Older Adults',
                ShortName: 'Drug Interactions',
                Identifier: 'DrugInteractions'
            },
            {
                TableNumber: 6,
                TableDefinition: 'Medications That Should Be Avoided or Have Their Dosage Reduced With Varying Levels of Kidney Function in Older Adults',
                ShortName: 'Renal Interactions',
                Identifier: 'Clearance'
            },
            {
                TableNumber: 7,
                TableDefinition: 'Drugs With Strong Anticholinergic Properties',
                ShortName: 'Anticholinergics',
                Identifier: 'Anticholinergics'
            },
        ];
    }
    TableService.prototype.emitSelectedTables = function (selections) {
        this.tableStatusSource.next(selections);
    };
    Object.defineProperty(TableService.prototype, "tables", {
        get: function () {
            return this._tables;
        },
        enumerable: false,
        configurable: true
    });
    TableService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], TableService);
    return TableService;
}());
exports.TableService = TableService;
