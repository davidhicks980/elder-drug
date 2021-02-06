"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var accordion_1 = require("@angular/cdk/accordion");
var layout_1 = require("@angular/cdk/layout");
var observers_1 = require("@angular/cdk/observers");
var overlay_1 = require("@angular/cdk/overlay");
var scrolling_1 = require("@angular/cdk/scrolling");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var fire_1 = require("@angular/fire");
var firestore_1 = require("@angular/fire/firestore");
var flex_layout_1 = require("@angular/flex-layout");
var forms_1 = require("@angular/forms");
var core_2 = require("@angular/material/core");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var select_1 = require("@angular/material/select");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var service_worker_1 = require("@angular/service-worker");
var environment_1 = require("../environments/environment");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var case_split_pipe_1 = require("./case-split.pipe");
var dropdown_component_1 = require("./components/layout/dropdown/dropdown.component");
var layout_component_1 = require("./components/layout/layout.component");
var drug_form_component_1 = require("./components/layout/side-navigation/drug-form/drug-form.component");
var sidebar_component_1 = require("./components/layout/side-navigation/sidebar.component");
var tab_component_1 = require("./components/layout/tab/tab.component");
var toolbar_component_1 = require("./components/layout/top-toolbar/toolbar.component");
var table_component_1 = require("./components/table/table.component");
var expanded_element_component_1 = require("./components/unused/expanded-element/expanded-element.component");
var expansion_panel_component_1 = require("./components/unused/expansion-panel/expansion-panel.component");
var logo_component_1 = require("./components/unused/logo/small-logo/logo-component");
var creation_spy_directive_1 = require("./directives/creation-spy.directive");
var rotate_icon_directive_1 = require("./directives/rotate-icon.directive");
var tracking_gradient_directive_1 = require("./directives/tracking-gradient.directive");
var material_module_1 = require("./material-module");
var to_string_pipe_1 = require("./to-string.pipe");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                layout_component_1.LayoutComponent,
                toolbar_component_1.ToolbarComponent,
                case_split_pipe_1.caseSplitPipe,
                table_component_1.TableComponent,
                logo_component_1.LogoComponent,
                drug_form_component_1.DrugFormComponent,
                sidebar_component_1.SidebarComponent,
                to_string_pipe_1.ToStringPipe,
                toolbar_component_1.DisclaimerComponent,
                toolbar_component_1.AboutComponent,
                toolbar_component_1.DesignComponent,
                expansion_panel_component_1.ExpansionPanelComponent,
                expanded_element_component_1.ExpandedElementComponent,
                rotate_icon_directive_1.RotateDirective,
                tracking_gradient_directive_1.TrackingGradientDirective,
                creation_spy_directive_1.CreationSpyDirective,
                dropdown_component_1.DropdownComponent,
                tab_component_1.TabComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                app_routing_module_1.ElderRoutingModule,
                layout_1.LayoutModule,
                material_module_1.MaterialModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                flex_layout_1.FlexLayoutModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule,
                select_1.MatSelectModule,
                http_1.HttpClientModule,
                fire_1.AngularFireModule.initializeApp(environment_1.environment.firebaseConfig),
                firestore_1.AngularFirestoreModule,
                scrolling_1.ScrollingModule,
                service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', {
                    enabled: environment_1.environment.production
                }),
                overlay_1.OverlayModule,
                core_2.MatRippleModule,
                observers_1.ObserversModule,
                accordion_1.CdkAccordionModule,
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
