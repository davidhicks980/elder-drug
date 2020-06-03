import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MaterialModule } from './material-module';
import { ToolbarComponent } from './tables/toobar.component';
import { TableViewComponent } from './tables/table-view/table-view.component';
import { FullTableComponent } from './tables/table-view/full-table/full-table.component';
import { ModifyTablePanelComponent } from './modify-table-panel/modify-table-panel.component';
import { DiseaseTableComponent } from './tables/table-view/disease-table/disease-table.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ToolbarComponent,
    TableViewComponent,
    FullTableComponent,
    ModifyTablePanelComponent,
    DiseaseTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
