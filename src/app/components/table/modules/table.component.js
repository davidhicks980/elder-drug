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
exports.BeersTableDataSource = exports.TableComponent = void 0;
var animations_1 = require("@angular/animations");
var coercion_1 = require("@angular/cdk/coercion");
var table_1 = require("@angular/cdk/table");
var core_1 = require("@angular/core");
var sort_1 = require("@angular/material/sort");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var animations_2 = require("../../animations");
var TableComponent = /** @class */ (function () {
    function TableComponent(columnService, firebase, tableService, stateService, changeDetect) {
        this.columnService = columnService;
        this.firebase = firebase;
        this.tableService = tableService;
        this.stateService = stateService;
        this.changeDetect = changeDetect;
        this.selectorInitiated = false;
        this.groupProperty = 'SearchTerm';
        this.selectedRow = false;
        this.groups = new Set();
        this.animations = true;
        this._expandedRows = new Set();
        this._fields = ['Items'];
        this.firebase = firebase;
        this.tableService = tableService;
        this.columnService = columnService;
        this.dataSource = new BeersTableDataSource(this.firebase.tableSource, this.groupProperty);
        this.dataSource.rawHeaderStream = this.columnService.recieveTableColumns$.pipe(operators_1.map(function (data) { return data.selected; }));
    }
    Object.defineProperty(TableComponent.prototype, "expandedRows", {
        set: function (rows) {
            this._expandedRows.add(rows);
        },
        enumerable: false,
        configurable: true
    });
    TableComponent.prototype.trackByFn = function (e, g) {
        return e + "-" + g;
    };
    TableComponent.prototype.filterData = function (term) {
        this.dataSource.filter = term.target.value;
    };
    TableComponent.prototype.expandRow = function (row) {
        if (!this.selectedRow) {
            this.selectedRow = row;
        }
        else {
            this.selectedRow = false;
        }
    };
    Object.defineProperty(TableComponent.prototype, "columnSpan", {
        get: function () {
            return this._fields.length;
        },
        enumerable: false,
        configurable: true
    });
    TableComponent.prototype.toggleGroup = function (term) {
        this.groups.has(term) ? this.groups["delete"](term) : this.groups.add(term);
        this.dataSource.expandedGroups = this.groups;
        this.changeDetect.markForCheck();
    };
    TableComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.sort = this.sort;
        this.changeDetect.markForCheck();
    };
    TableComponent.prototype.isGroup = function (index, item) {
        return item.isGroup;
    };
    TableComponent.prototype.isShown = function (index, item) {
        return !item.isGroup;
    };
    TableComponent.prototype.trackingFunct = function (id, item) {
        return item.tableID;
    };
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], TableComponent.prototype, "sort");
    TableComponent = __decorate([
        core_1.Component({
            selector: 'elder-table',
            templateUrl: './table.component.html',
            styleUrls: ['./table.component.scss'],
            animations: [
                animations_2.slideDownAnimation,
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
                /** Animation that moves the sort indicator. */
                animations_1.trigger('indicator', [
                    animations_1.state('active-asc, asc', animations_1.style({ transform: 'translateY(-6px)' })),
                    // 10px is the height of the sort indicator, minus the width of the pointers
                    animations_1.state('active-desc, desc', animations_1.style({ transform: 'translateY(4px)' })),
                    animations_1.transition('active-asc <=> active-desc', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
            ],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
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
    function BeersTableDataSource(dataStream, groupTerm) {
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
        _this._group = new rxjs_1.BehaviorSubject(new Set());
        _this._dataLoaded = false;
        _this._displayedHeaders = new rxjs_1.BehaviorSubject([]);
        /**
         * Data accessor function that is used for accessing data properties for sorting through
         * the default sortData function.
         * This default function assumes that the sort header IDs (which defaults to the column name)
         * matches the data's properties (e.g. column Xyz represents data['Xyz']).
         * May be set to a custom function for different behavior.
         *
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
         *
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
        _this._mapReduceEmptyColumns = operators_1.map(function (_a) {
            var items = _a[0], headers = _a[1];
            return Array.from(items.reduce(function (acc, curr) {
                for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                    var header = headers_1[_i];
                    if (curr[header] || curr[header] === false) {
                        acc.add(header);
                    }
                }
                return acc;
            }, new Set()));
        });
        _this._groupTerm = new rxjs_1.BehaviorSubject(groupTerm);
        _this._data = _this.convertObservableToBehaviorSubject(dataStream);
        _this._updateChangeSubscription();
        return _this;
    }
    Object.defineProperty(BeersTableDataSource.prototype, "displayedHeaders", {
        get: function () {
            return this._displayedHeaders.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "rawHeaderStream", {
        /** Ingests a stream of any columns that are marked to be shown and that contain data
         * @property {headers} headers - A stream of headers from your table source.
         */
        set: function (headers) {
            var _this = this;
            rxjs_1.combineLatest([this._data, headers])
                .pipe(this._mapReduceEmptyColumns, operators_1.map(function (items) {
                return _this._groupTerm
                    ? items.filter(function (item) { return item != _this.groupTerm; })
                    : items;
            }))
                .subscribe(function (items) { return _this._displayedHeaders.next(items); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "dataLoaded", {
        get: function () {
            return this._dataLoaded;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "groupTerm", {
        get: function () {
            if (this._groupTerm.value) {
                return this._groupTerm.value;
            }
        },
        set: function (term) {
            if (term && typeof term === 'string' && term.length > 0) {
                this._groupTerm.next(term);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BeersTableDataSource.prototype, "expandedGroups", {
        get: function () {
            return this._group.value;
        },
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
    BeersTableDataSource.prototype._groupingPredicate = function (data) {
        var _this = this;
        var dataWithHeaderRows = [];
        var groupHeaders = this._extractGroupHeaders(data);
        var expanded;
        var headerRow;
        var rows;
        var _loop_1 = function (header) {
            expanded = this_1.expandedGroups.has(header);
            headerRow = {
                isGroup: true,
                expanded: expanded,
                term: header
            };
            if (expanded) {
                dataWithHeaderRows = dataWithHeaderRows.concat([headerRow], data.reduce(function (rows, item) {
                    if (item[_this.groupTerm] === header) {
                        rows.push(item);
                    }
                    return rows;
                }, []));
            }
            else {
                dataWithHeaderRows.push(headerRow);
            }
        };
        var this_1 = this;
        for (var _i = 0, groupHeaders_1 = groupHeaders; _i < groupHeaders_1.length; _i++) {
            var header = groupHeaders_1[_i];
            _loop_1(header);
        }
        return dataWithHeaderRows;
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
        var groupingParameters = rxjs_1.combineLatest([this._group, this._groupTerm]);
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
        var groupedData = rxjs_1.combineLatest([orderedData, groupingParameters]).pipe(operators_1.map(function (_a) {
            var data = _a[0];
            return _this._groupingPredicate(data);
        }));
        // Watched for paged data changes and send the result to the table to render.
        (_a = this._renderChangesSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this._renderChangesSubscription = groupedData.subscribe(function (data) {
            _this._renderData.next(data);
            _this._dataLoaded = true;
        });
    };
    BeersTableDataSource.prototype._extractGroupHeaders = function (data) {
        var _this = this;
        return Array.from(new Set(data.map(function (items) { return items[_this.groupTerm]; })));
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
     *
     * @docs-private
     */
    BeersTableDataSource.prototype.connect = function () {
        if (!this._renderChangesSubscription) {
            this._updateChangeSubscription();
        }
        console.log(this._renderData.value);
        return this._renderData;
    };
    /**
     * Used by the MatTable. Called when it disconnects from the data source.
     *
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
