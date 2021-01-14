import { animate, style, transition, trigger } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

import { FirebaseService } from '../firebase.service';
import { LayoutStatus, StateService } from '../state.service';
import { TableService } from '../table.service';

@Component({
  selector: 'app-content',
  template: `
    <div
      #content
      [fxLayout]="mobileContent ? 'column' : 'row'"
      [class]="
        mobileContent
          ? 'mobile-height table-viewport'
          : 'desktop-height table-viewport'
      "
    >
      <ng-container *ngIf="loaded">
        <div [fxFlexOrder]="mobileContent ? 2 : 1" fxFlex="auto">
          <br />
          <ng-container *ngFor="let table of enabledTables">
            <div fxLayout="column" fxLayoutAlign="start center">
              <app-expansion-panel
                [style.width]="
                  mobileContent
                    ? this.contentWidth
                    : this.expansionPanelWidth + 'px'
                "
                [style.maxWidth]="this.contentWidth"
              >
                <div panel-icon>
                  <mat-icon
                    class="active"
                    [svgIcon]="table.TableIconName"
                  ></mat-icon>
                </div>
                <div
                  panel-header
                  aria-label="expand this panel to see drugs that match your search"
                >
                  {{ table.ShortName | toString }}
                </div>
                <div panel-description>
                  {{ table.Description }}
                </div>
                <div panel-content>
                  <app-table [tableName]="table.TableNumber"> </app-table></div
              ></app-expansion-panel>
              <br />
            </div>
          </ng-container>
        </div>
        <div
          [fxFlexOrder]="mobileContent ? 1 : 2"
          [fxFlex]="mobileContent ? '140px' : '200px'"
          fxLayout="column"
        >
          <modify-table-panel></modify-table-panel>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('2s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ContentComponent implements AfterViewInit {
  @ViewChild('content') content: ElementRef;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  layout!: LayoutStatus;
  loaded: boolean = false;
  smallContent: ReplaySubject<boolean> = new ReplaySubject();
  observedSmallContent: Observable<boolean> = this.smallContent.asObservable();
  observeWidthCheck: boolean;
  smallestContent: boolean;
  observer: ResizeObserver;
  mobileContent: boolean = true;
  expansionPanelWidth: number;
  contentWidth: string;
  enabledTables: {
    TableNumber: number;
    TableDefinition: string;
    ShortName: string;
    Identifier: string;
  }[];

  ngAfterViewInit() {
    let check;
    let width;
    this.observer = new ResizeObserver((entries, observer) => {
      if (this.content) {
        check = this.mobileContent;
        width = entries[0].borderBoxSize[0].inlineSize;
        this.expansionPanelWidth = width - 220;
        this.contentWidth = width - 20 + 'px';
        this.mobileContent = width < 600;
        if (this.mobileContent != check) {
          this.state.emitContentWidthStatus(this.mobileContent);
        }
      }
    });
    this.observer.observe(this.content.nativeElement);
  }
  constructor(
    public firestore: FirebaseService,
    public state: StateService,
    public tableService: TableService
  ) {
    this.state = state;

    this.tableService.tableStatus$.subscribe((active) => {
      this.enabledTables = active.map(
        (table) =>
          tableService.tables.filter((tab) => tab.TableNumber === table)[0]
      );

      if (!this.loaded) {
        this.loaded = true;
      }
    });
  }
}
