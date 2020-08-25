import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { TableModule } from 'primeng/table';
import { ToStringPipe } from './to-string.pipe';
import { caseSplitPipe } from './case-split.pipe';
import { AppRoutingModule } from './app-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { MaterialModule } from './material-module';
import { ToolbarComponent } from './navigation/top-toolbar/toolbar.component';
import { MedTableComponent } from './table-logic/med-table/med-table.component';
import { TableLogicComponent } from './table-logic/table-logic.component';
import { SmallLogoComponent } from './logo/small-logo/small-logo.component';
import { BigLogoComponent } from './logo/big-logo/big-logo.component';
import { EnterDrugFormComponent } from './navigation/enter-drug-form/enter-drug-form.component';
import { ColumnSelectorComponent } from './table-logic/med-table/column-selector/column-selector.component';
import { ToggleOptionsComponent } from './table-logic/med-table/toggle-options/toggle-options.component';

import { SideNavigationComponent } from './navigation/side-navigation/side-navigation.component';

import { ModifyTablePanelComponent } from './table-logic/modify-table-panel/modify-table-panel.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ToolbarComponent,
    caseSplitPipe,
    MedTableComponent,
    TableLogicComponent,
    SmallLogoComponent,
    BigLogoComponent,
    EnterDrugFormComponent,
    ColumnSelectorComponent,
    ToggleOptionsComponent,
    SideNavigationComponent,
    ModifyTablePanelComponent,
    ToStringPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
