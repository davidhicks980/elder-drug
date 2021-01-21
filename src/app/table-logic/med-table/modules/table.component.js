"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BeersTableDataSource = exports.MedTableComponent = void 0;
var animations_1 = require("@angular/animations");
var coercion_1 = require("@angular/cdk/coercion");
var table_1 = require("@angular/cdk/table");
var core_1 = require("@angular/core");
var sort_1 = require("@angular/material/sort");
var rxjs_1 = require("rxjs");
var from_1 = require("rxjs/internal/observable/from");
var operators_1 = require("rxjs/operators");
var animations_2 = require("../../animations");
var MedTableComponent = /** @class */ (function () {
    function MedTableComponent(columnService, firebase, tableService, stateService, changeDetect) {
        var _this = this;
        this.columnService = columnService;
        this.firebase = firebase;
        this.tableService = tableService;
        this.stateService = stateService;
        this.changeDetect = changeDetect;
        this.selectorInitiated = false;
        this.currentGrouping = new rxjs_1.BehaviorSubject({
            term: 'SearchTerm',
            shown: ['ibuprofen']
        });
        this.selectedRow = false;
        this.groups = [];
        this.fields = [];
        this.firebase = firebase;
        this.tableService = tableService;
        this.columnService = columnService;
        this.columnService.recieveTableColumns$.pipe(operators_1.tap(function () { return (_this.fieldIndices = []); }));
        this.dataSource = new BeersTableDataSource(rxjs_1.combineLatest([this.firebase.tableSource, this.currentGrouping]).pipe(operators_1.switchMap(function (_a) {
            var data = _a[0], groupingCriteria = _a[1];
            return from_1.from(data).pipe(operators_1.groupBy(function (data) { return data[groupingCriteria.term]; }), operators_1.mergeMap(function (group) { return group.pipe(operators_1.toArray()); }), operators_1.map(function (items) {
                var term = items[0][groupingCriteria.term];
                var shown = groupingCriteria.shown.includes(term);
                items.forEach(function (item, i) {
                    Object.assign(item, {
                        tableID: item.EntryID + "-" + item.SearchTerm,
                        isGroup: false
                    });
                });
                items.unshift({
                    groupBy: items[0][groupingCriteria.term],
                    showTables: shown,
                    isGroup: true
                });
                return items;
            }), operators_1.reduce(function (acc, curr) {
                acc.push.apply(acc, curr);
                return acc;
            }, []));
        })));
    }
    MedTableComponent.prototype.trackByFn = function (e, g) {
        console.log(g);
        return g;
    };
    MedTableComponent.prototype.expandRow = function (row) {
        if (!this.selectedRow)
            this.selectedRow = row;
        else
            this.selectedRow = false;
    };
    MedTableComponent.prototype.shouldDisplay = function (term) {
        return this.groups.includes(term);
    };
    MedTableComponent.prototype.toggleGroup = function (term, row) {
        this.groups.includes(row.groupBy)
            ? this.groups.splice(this.groups.indexOf(row.groupBy), 1)
            : this.groups.push(row.groupBy);
        this.dataSource.group = this.groups;
    };
    MedTableComponent.prototype.moveSearchTerms = function (arr, item) {
        var index = arr.indexOf(item);
        arr.splice(index, 1);
        arr.unshift(item);
    };
    MedTableComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
    };
    MedTableComponent.prototype.isGroup = function (index, item) {
        return item.isGroup;
    };
    MedTableComponent.prototype.isShown = function (index, item) {
        return !item.isGroup;
    };
    MedTableComponent.prototype.trackingFunct = function (id, item) {
        return item.tableID;
    };
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], MedTableComponent.prototype, "sort");
    MedTableComponent = __decorate([
        core_1.Component({
            selector: 'app-table',
            templateUrl: './table.component.html',
            styleUrls: ['./med-table.component.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            animations: [
                animations_1.trigger('expandButton', [
                    animations_1.state('default', animations_1.style({ transform: 'rotate(0deg)' })),
                    animations_1.state('rotated', animations_1.style({ transform: 'rotate(90deg)' })),
                    animations_1.transition('rotated => default', animations_1.animate('400ms ease-out')),
                    animations_1.transition('default => rotated', animations_1.animate('400ms ease-in')),
                ]),
                animations_2.slideDownAnimation,
                animations_1.trigger('rotateChevron', [
                    animations_1.state('collapsed', animations_1.style({ transform: 'rotate(0deg)' })),
                    animations_1.state('expanded', animations_1.style({ transform: 'rotate(-90deg)' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
                animations_1.trigger('translateRationale', [
                    animations_1.state('expanded', animations_1.style({ transform: 'translateY(0)' })),
                    animations_1.state('closed', animations_1.style({ transform: 'translateY(-200px)' })),
                    animations_1.transition('closed<=>expanded', animations_1.animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                    animations_1.transition('expanded<=>closed', animations_1.animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
                animations_1.trigger('detailExpand', [
                    animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                    animations_1.state('expanded', animations_1.style({ height: '*' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
            ]
        })
    ], MedTableComponent);
    return MedTableComponent;
}());
exports.MedTableComponent = MedTableComponent;
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
var MAX_SAFE_INTEGER = 9007199254740991;
/** Shared base class with MDC-based implementation. */
var BeersTableDataSource = /** @class */ (function (_super) {
    __extends(BeersTableDataSource, _super);
    function BeersTableDataSource(dataStream) {
        var _this = _super.call(this) || this;
        /** Stream emitting render data to the table (depends on ordered data changes). */
        _this._renderData = new rxjs_1.BehaviorSubject([]);
        /** Stream that emits when a new filter string is set on the data source. */
        _this._filter = new rxjs_1.BehaviorSubject('');
        /** Used to react to internal changes of the paginator that are made by the data source itself. */
        _this._internalPageChanges = new rxjs_1.Subject();
        /**
         * Subscription to the changes that should trigger an update to the table's rendered rows, such
         * as filtering, sorting, pagination, or base data changes.
         */
        _this._renderChangesSubscription = null;
        /**
         * The filtered set of data that has been matched by the filter string, or all the data if there
         * is no filter. Useful for knowing the set of data the table represents.
         * For example, a 'selectAll()' function would likely want to select the set of filtered data
         * shown to the user rather than all the data.
         */
        _this._group = new rxjs_1.BehaviorSubject([]);
        _this._groupTerm = 'SearchTerm';
        /**
         * Data accessor function that is used for accessing data properties for sorting through
         * the default sortData function.
         * This default function assumes that the sort header IDs (which defaults to the column name)
         * matches the data's properties (e.g. column Xyz represents data['Xyz']).
         * May be set to a custom function for different behavior.
         * @param data Data object that is being accessed.
         * @param sortHeaderId The name of the column that represents the data.
         */
        _this.sortingDataAccessor = function (data, sortHeaderId) {
            var value = data[sortHeaderId];
            if (coercion_1._isNumberValue(value)) {
                var numberValue = Number(value);
                // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
                // leave them as strings. For more info: https://goo.gl/y5vbSg
                return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
            }
            return value;
        };
        /**
         * Gets a sorted copy of the data array based on the state of the MatSort. Called
         * after changes are made to the filtered data or when sort changes are emitted from MatSort.
         * By default, the function retrieves the active sort and its direction and compares data
         * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
         * of data ordering.
         * @param data The array of data that should be sorted.
         * @param sort The connected MatSort that holds the current sort state.
         */
        _this.sortData = function (data, sort) {
            var active = sort.active;
            var direction = sort.direction;
            if (!active || direction == '') {
                return data;
            }
            return data.sort(function (a, b) {
                var valueA = _this.sortingDataAccessor(a, active);
                var valueB = _this.sortingDataAccessor(b, active);
                // If there are data in the column that can be converted to a number,
                // it must be ensured that the rest of the data
                // is of the same type so as not to order incorrectly.
                var valueAType = typeof valueA;
                var valueBType = typeof valueB;
                if (valueAType !== valueBType) {
                    if (valueAType === 'number') {
                        valueA += '';
                    }
                    if (valueBType === 'number') {
                        valueB += '';
                    }
                }
                // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
                // one value exists while the other doesn't. In this case, existing value should come last.
                // This avoids inconsistent results when comparing values to undefined/null.
                // If neither value exists, return 0 (equal).
                var comparatorResult = 0;
                if (valueA != null && valueB != null) {
                    // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
                    if (valueA > valueB) {
                        comparatorResult = 1;
                    }
                    else if (valueA < valueB) {
                        comparatorResult = -1;
                    }
                }
                else if (valueA != null) {
                    comparatorResult = 1;
                }
                else if (valueB != null) {
                    comparatorResult = -1;
                }
                return comparatorResult * (direction == 'asc' ? 1 : -1);
            });
        };
        /**
         * Checks if a data object matches the data source's filter string. By default, each data object
         * is converted to a string of its properties and returns true if the filter has
         * at least one occurrence in that string. By default, the filter string has its whitespace
         * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
         * filter matching.
         * @param data Data object used to check against the filter.
         * @param filter Filter string that has been set on the data source.
         * @returns Whether the filter matches against the data
         */
        _this.filterPredicate = function (data, filter) {
            // Transform the data into a lowercase string of all property values.
            var dataStr = Object.keys(data)
                .reduce(function (currentTerm, key) {
                // Use an obscure Unicode character to delimit the words in the concatenated string.
                // This avoids matches where the values of two columns combined will match the user's query
                // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
                // that has a very low chance of being typed in by somebody in a text field. This one in
                // particular is "White up-pointing triangle with dot" from
                // https://en.wikipedia.org/wiki/List_of_Unicode_characters
                return currentTerm + data[key] + '◬';
            }, '')
                .toLowerCase();
            // Transform the filter by converting it to lowercase and removing whitespace.
            var transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) != -1;
        };
        _this._data = _this.convertObservableToBehaviorSubject(dataStream);
        _this._updateChangeSubscription();
        return _this;
    }
    Object.defineProperty(BeersTableDataSource.prototype, "groupTerm", {
        set: function (term) {
            this._groupTerm = term;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "group", {
        set: function (group) {
            this._group.next(group);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "data", {
        /** Array of data that should be rendered by the table, where each object represents one row. */
        get: function () {
            return this._data.value;
        },
        set: function (data) {
            this._data.next(data);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "filter", {
        /**
         * Filter term that should be used to filter out objects from the data array. To override how
         * data objects match to this filter string, provide a custom function for filterPredicate.
         */
        get: function () {
            return this._filter.value;
        },
        set: function (filter) {
            this._filter.next(filter);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "sort", {
        /**
         * Instance of the MatSort directive used by the table to control its sorting. Sort changes
         * emitted by the MatSort will trigger an update to the table's rendered data.
         */
        get: function () {
            return this._sort;
        },
        set: function (sort) {
            this._sort = sort;
            this._updateChangeSubscription();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "paginator", {
        /**
         * Instance of the MatPaginator component used by the table to control what page of the data is
         * displayed. Page changes emitted by the MatPaginator will trigger an update to the
         * table's rendered data.
         *
         * Note that the data source uses the paginator's properties to calculate which page of data
         * should be displayed. If the paginator receives its properties as template inputs,
         * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
         * initialized before assigning it to this data source.
         */
        get: function () {
            return this._paginator;
        },
        set: function (paginator) {
            this._paginator = paginator;
            this._updateChangeSubscription();
        },
        enumerable: false,
        configurable: true
    });
    BeersTableDataSource.prototype.convertObservableToBehaviorSubject = function (observable) {
        var observed;
        observable.toPromise().then(function (item) {
            observed = item;
        });
        var subject = new rxjs_1.BehaviorSubject(observed);
        observable.subscribe(function (x) {
            subject.next(x);
        }, function (err) {
            subject.error(err);
        }, function () {
            subject.complete();
        });
        return subject;
    };
    /**
     * Subscribe to changes that should trigger an update to the table's rendered rows. When the
     * changes occur, process the current state of the filter, sort, and pagination along with
     * the provided base data and send it to the table for rendering.
     */
    BeersTableDataSource.prototype._updateChangeSubscription = function () {
        var _this = this;
        var _a;
        // Sorting and/or pagination should be watched if MatSort and/or MatPaginator are provided.
        // The events should emit whenever the component emits a change or initializes, or if no
        // component is provided, a stream with just a null event should be provided.
        // The `sortChange` and `pageChange` acts as a signal to the combineLatests below so that the
        // pipeline can progress to the next step. Note that the value from these streams are not used,
        // they purely act as a signal to progress in the pipeline.
        var sortChange = this._sort
            ? rxjs_1.merge(this._sort.sortChange, this._sort.initialized)
            : rxjs_1.of(null);
        var dataStream = this._data;
        // Watch for base data or filter changes to provide a filtered set of data.
        var filteredData = rxjs_1.combineLatest([dataStream, this._filter]).pipe(operators_1.map(function (_a) {
            var data = _a[0];
            return _this._filterData(data);
        }));
        // Watch for base data or filter changes to provide a filtered set of data.
        // Watch for filtered data or sort changes to provide an ordered set of data.
        var orderedData = rxjs_1.combineLatest([filteredData, sortChange]).pipe(operators_1.map(function (_a) {
            var data = _a[0];
            return _this._orderData(data);
        }));
        var groupedData = rxjs_1.combineLatest([orderedData, this._group]).pipe(operators_1.switchMap(function (_a) {
            var items = _a[0], group = _a[1];
            return from_1.from(items).pipe(operators_1.reduce(function (acc, curr) {
                if (group.includes(curr[_this._groupTerm]))
                    acc.push(curr);
                if (curr.isGroup)
                    acc.push(curr);
                return acc;
            }, []));
        }), operators_1.tap(function (data) { return console.log(data); }));
        // Watched for paged data changes and send the result to the table to render.
        (_a = this._renderChangesSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this._renderChangesSubscription = groupedData.subscribe(function (data) {
            return _this._renderData.next(data);
        });
    };
    /**
     * Returns a filtered data array where each filter object contains the filter string within
     * the result of the filterTermAccessor function. If no filter is set, returns the data array
     * as provided.
     */
    BeersTableDataSource.prototype._filterData = function (data) {
        var _this = this;
        // If there is a filter string, filter out data that does not contain it.
        // Each data object is converted to a string using the function defined by filterTermAccessor.
        // May be overridden for customization.
        this.filteredData =
            this.filter == null || this.filter === ''
                ? data
                : data.filter(function (obj) { return _this.filterPredicate(obj, _this.filter); });
        return this.filteredData;
    };
    /**
     * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
     * data array as provided. Uses the default data accessor for data lookup, unless a
     * sortDataAccessor function is defined.
     */
    BeersTableDataSource.prototype._orderData = function (data) {
        // If there is no active sort or direction, return the data without trying to sort.
        if (!this.sort) {
            return data;
        }
        return this.sortData(data.slice(), this.sort);
    };
    /**
     * Used by the MatTable. Called when it connects to the data source.
     * @docs-private
     */
    BeersTableDataSource.prototype.connect = function () {
        if (!this._renderChangesSubscription) {
            this._updateChangeSubscription();
        }
        return this._renderData;
    };
    /**
     * Used by the MatTable. Called when it disconnects from the data source.
     * @docs-private
     */
    BeersTableDataSource.prototype.disconnect = function () {
        var _a;
        (_a = this._renderChangesSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this._renderChangesSubscription = null;
    };
    return BeersTableDataSource;
}(table_1.DataSource));
exports.BeersTableDataSource = BeersTableDataSource;
