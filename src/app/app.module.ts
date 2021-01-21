import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TableModule } from 'primeng/table';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { caseSplitPipe } from './case-split.pipe';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { LogoComponent } from './logo/small-logo/logo-component';
import { MaterialModule } from './material-module';
import { EmptyInputComponent, EnterDrugFormComponent } from './navigation/enter-drug-form/enter-drug-form.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SideNavigationComponent } from './navigation/side-navigation/side-navigation.component';
import {
  AboutComponent,
  DesignComponent,
  DisclaimerComponent,
  ToolbarComponent,
} from './navigation/top-toolbar/toolbar.component';
import { ContentComponent } from './table-logic/content.component';
import { ColumnSelectorComponent } from './table-logic/med-table/column-selector/column-selector.component';
import { MedTableComponent } from './table-logic/med-table/table.component';
import { ToggleOptionsComponent } from './table-logic/med-table/toggle-options/toggle-options.component';
import { ModifyTablePanelComponent } from './table-logic/modify-table-panel/modify-table-panel.component';
import { ToStringPipe } from './to-string.pipe';
import { ExpandedElementComponent } from './expanded-element/expanded-element.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ToolbarComponent,
    EmptyInputComponent,
    caseSplitPipe,
    MedTableComponent,
    ContentComponent,
    LogoComponent,
    EnterDrugFormComponent,
    ColumnSelectorComponent,
    ToggleOptionsComponent,
    SideNavigationComponent,
    ModifyTablePanelComponent,
    ToStringPipe,
    DisclaimerComponent,
    AboutComponent,
    DesignComponent,
    ExpansionPanelComponent,
    ExpandedElementComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    TableModule,
    MatSelectModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ScrollingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    OverlayModule,
    MatRippleModule,
    ObserversModule,
    CdkAccordionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA], // add this line
})
export class AppModule {}
