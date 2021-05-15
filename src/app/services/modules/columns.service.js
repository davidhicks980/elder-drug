"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
exports.__esModule = true;
exports.Category = exports.ColumnField = exports.ColumnService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ColumnService = /** @class */ (function () {
  function ColumnService() {
    this.columnOptions = [
      { field: "EntryID", header: "Entry Number" },
      { field: "DiseaseState", header: "Disease State" },
      { field: "Category", header: "Category Number" },
      { field: "TableDefinition", header: "Table Definition" },
      { field: "MatchedBeersEntry", header: "Item" },
      { field: "MinimumClearance", header: "Min Clearance" },
      { field: "MaximumClearance", header: "Max Clearance" },
      { field: "DrugInteraction", header: "Drug Interaction" },
      { field: "Inclusion", header: "Includes" },
      { field: "Exclusion", header: "Excludes" },
      { field: "Rationale", header: "Rationale" },
      { field: "Recommendation", header: "Recommendation" },
      { field: "RecommendationLineTwo", header: "LineTwo" },
      { field: "ItemType", header: "Type" },
      { field: "ShortTableName", header: "Table" },
      { field: "SearchTerms", header: "Search Term" },
    ];
    this.columnDefinitions = [
      {
        description: "General Info",
        filters: [null],
        id: Category.General,
        columnOptions: [
          { id: ColumnField.SearchTerms, selected: true },
          { id: ColumnField.Item, selected: true },
          { id: ColumnField.Exclusion, selected: true },
          { id: ColumnField.Inclusion, selected: true },
          { id: ColumnField.Recommendation, selected: true },
          { id: ColumnField.DiseaseState, selected: true },
          { id: ColumnField.DrugInteraction, selected: false },
          { id: ColumnField.ShortName, selected: true },
        ],
      },
      {
        description: "Disease-Specific",
        filters: [ColumnField.DiseaseState],
        id: Category.DiseaseGuidance,
        columnOptions: [
          { id: ColumnField.SearchTerms, selected: true },
          { id: ColumnField.Item, selected: true },
          { id: ColumnField.Exclusion, selected: true },
          { id: ColumnField.Inclusion, selected: true },
          { id: ColumnField.Recommendation, selected: false },
          { id: ColumnField.DiseaseState, selected: true },
        ],
      },
      {
        description: "Renal Interactions",
        id: Category.RenalEffect,
        filters: [ColumnField.MaximumClearance, ColumnField.MinimumClearance],
        columnOptions: [
          { id: ColumnField.SearchTerms, selected: true },
          { id: ColumnField.Item, selected: true },
          { id: ColumnField.MinimumClearance, selected: true },
          { id: ColumnField.MaximumClearance, selected: true },
          { id: ColumnField.Inclusion, selected: false },
          { id: ColumnField.Exclusion, selected: false },
          { id: ColumnField.Recommendation, selected: true },
        ],
      },
      {
        description: "Drug Interactions",
        filters: [ColumnField.DrugInteraction],
        id: Category.DrugInteractions,
        columnOptions: [
          { id: ColumnField.SearchTerms, selected: true },
          { id: ColumnField.Item, selected: true },
          { id: ColumnField.DrugInteraction, selected: true },
          { id: ColumnField.Inclusion, selected: true },
          { id: ColumnField.Exclusion, selected: true },
          { id: ColumnField.Recommendation, selected: true },
          { id: ColumnField.Rationale, selected: false },
        ],
      },
    ];
    // Observable string sources
    this.tableColumns = new rxjs_1.Subject();
    this.optionsList = new rxjs_1.Subject();
    // Observable string streams
    this.recieveTableColumns$ = this.tableColumns.asObservable();
  }
  ColumnService.prototype.requestTable = function (table) {
    var options = this.columnDefinitions.filter(function (columns) {
      return columns.id === table;
    })[0].columnOptions;
    var selectedFields = options
      .filter(function (item) {
        return item.selected;
      })
      .map(function (item) {
        return item.id;
      });
    var allFields = options.map(function (item) {
      return item.id;
    });
    this.tableColumns.next({ selected: selectedFields, all: allFields });
  };
  ColumnService = __decorate(
    [
      core_1.Injectable({
        providedIn: "root",
      }),
    ],
    ColumnService
  );
  return ColumnService;
})();
exports.ColumnService = ColumnService;
var ColumnField;
(function (ColumnField) {
  ColumnField["EntryID"] = "EntryID";
  ColumnField["DiseaseState"] = "DiseaseState";
  ColumnField["Category"] = "Category";
  ColumnField["TableDefinition"] = "TableDefinition";
  ColumnField["Item"] = "Item";
  ColumnField["MinimumClearance"] = "MinimumClearance";
  ColumnField["MaximumClearance"] = "MaximumClearance";
  ColumnField["DrugInteraction"] = "DrugInteraction";
  ColumnField["Inclusion"] = "Inclusion";
  ColumnField["Exclusion"] = "Exclusion";
  ColumnField["Rationale"] = "Rationale";
  ColumnField["Recommendation"] = "Recommendation";
  ColumnField["RecommendationLineTwo"] = "RecommendationLineTwo";
  ColumnField["ShortName"] = "ShortName";
  ColumnField["SearchTerm"] = "SearchTerm";
})((ColumnField = exports.ColumnField || (exports.ColumnField = {})));
var Category;
(function (Category) {
  Category[(Category["General"] = 1)] = "General";
  Category[(Category["PotentiallyInnappropriate"] = 2)] =
    "PotentiallyInnappropriate";
  Category[(Category["DiseaseGuidance"] = 3)] = "DiseaseGuidance";
  Category[(Category["Caution"] = 4)] = "Caution";
  Category[(Category["DrugInteractions"] = 5)] = "DrugInteractions";
  Category[(Category["RenalEffect"] = 6)] = "RenalEffect";
  Category[(Category["Anticholinergics"] = 7)] = "Anticholinergics";
})((Category = exports.Category || (exports.Category = {})));
