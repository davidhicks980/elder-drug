"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var flex_layout_1 = require("@angular/flex-layout");
var animations_1 = require("@angular/platform-browser/animations");
var layout_1 = require("@angular/cdk/layout");
var forms_1 = require("@angular/forms");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var select_1 = require("@angular/material/select");
var http_1 = require("@angular/common/http");
var fire_1 = require("@angular/fire");
var firestore_1 = require("@angular/fire/firestore");
var app_component_1 = require("./app.component");
var table_1 = require("primeng/table");
var to_string_pipe_1 = require("./to-string.pipe");
var case_split_pipe_1 = require("./case-split.pipe");
var app_routing_module_1 = require("./app-routing.module");
var navigation_component_1 = require("./navigation/navigation.component");
var material_module_1 = require("./material-module");
var toolbar_component_1 = require("./navigation/top-toolbar/toolbar.component");
var med_table_component_1 = require("./table-logic/med-table/med-table.component");
var content_component_1 = require("./table-logic/content.component");
var logo_component_1 = require("./logo/small-logo/logo-component");
var enter_drug_form_component_1 = require("./navigation/enter-drug-form/enter-drug-form.component");
var column_selector_component_1 = require("./table-logic/med-table/column-selector/column-selector.component");
var toggle_options_component_1 = require("./table-logic/med-table/toggle-options/toggle-options.component");
var side_navigation_component_1 = require("./navigation/side-navigation/side-navigation.component");
var modify_table_panel_component_1 = require("./table-logic/modify-table-panel/modify-table-panel.component");
var environment_1 = require("../environments/environment");
var scrolling_1 = require("@angular/cdk/scrolling");
var ngx_datatable_1 = require("@swimlane/ngx-datatable");
var service_worker_1 = require("@angular/service-worker");
var toolbar_component_2 = require("./navigation/top-toolbar/toolbar.component");
var overlay_1 = require("@angular/cdk/overlay");
var scrollpanel_1 = require("primeng/scrollpanel");
var panel_1 = require("primeng/panel");
var logo_large_component_1 = require("./logo-large/logo-large.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                navigation_component_1.NavigationComponent,
                toolbar_component_1.ToolbarComponent,
                enter_drug_form_component_1.EmptyInputComponent,
                case_split_pipe_1.caseSplitPipe,
                med_table_component_1.MedTableComponent,
                content_component_1.ContentComponent,
                logo_component_1.LogoComponent,
                enter_drug_form_component_1.EnterDrugFormComponent,
                column_selector_component_1.ColumnSelectorComponent,
                toggle_options_component_1.ToggleOptionsComponent,
                side_navigation_component_1.SideNavigationComponent,
                modify_table_panel_component_1.ModifyTablePanelComponent,
                to_string_pipe_1.ToStringPipe,
                toolbar_component_1.DisclaimerComponent,
                toolbar_component_2.AboutComponent,
                toolbar_component_2.DesignComponent,
                logo_large_component_1.LogoLargeComponent,
            ],
            imports: [
                animations_1.BrowserAnimationsModule,
                app_routing_module_1.AppRoutingModule,
                layout_1.LayoutModule,
                material_module_1.MaterialModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                flex_layout_1.FlexLayoutModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule,
                table_1.TableModule,
                select_1.MatSelectModule,
                http_1.HttpClientModule,
                fire_1.AngularFireModule.initializeApp(environment_1.environment.firebaseConfig),
                firestore_1.AngularFirestoreModule,
                scrolling_1.ScrollingModule,
                service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', {
                    enabled: environment_1.environment.production
                }),
                overlay_1.OverlayModule,
                scrollpanel_1.ScrollPanelModule,
                panel_1.PanelModule,
                ngx_datatable_1.NgxDatatableModule,
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
