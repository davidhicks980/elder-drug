import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RowDetailComponent } from './row-detail.component';
import { FlatRowGroup } from '../../interfaces/RowGroup';
import { TableEntry } from '../../interfaces/TableEntry';

import { BeersSearchResult } from '../../services/search.service';

type Result = Partial<TableEntry<BeersSearchResult> | FlatRowGroup<BeersSearchResult>>;
@Directive({
  selector: '[rowDetail]',
})
export class RowDetailDirective implements OnDestroy, OnInit {
  private updateSource: BehaviorSubject<{ expand: boolean; group: boolean }> = new BehaviorSubject({
    expand: false,
    group: true,
  });
  private groupRow: boolean;
  private fields: BeersSearchResult;
  private expansionFactory: ComponentFactory<RowDetailComponent<BeersSearchResult>>;
  private expansionPanel: ComponentRef<RowDetailComponent<BeersSearchResult>>;
  private detail: Partial<FlatRowGroup<BeersSearchResult> | TableEntry<BeersSearchResult>>;
  @Input() set rowDetail(detail: Result) {
    let { position } = detail;
    if (this.detail && this.detail?.position?.hash === position?.hash) {
      return;
    }
    this.detail = detail;
    this.groupRow = position.isGroup;
    if (this.groupRow === false) {
      this.fields = (detail as TableEntry<unknown>).fields as BeersSearchResult;
    }
    this.updatePanel();
  }
  get rowDetail() {
    return this.detail;
  }
  @HostBinding('aria-expanded') ariaExpanded: boolean = false;
  @Input()
  set rowDetailVisible(expanded: boolean) {
    if (expanded != this.ariaExpanded) {
      this.ariaExpanded = expanded;
      this.updatePanel();
    }
  }
  get rowDetailVisible() {
    return this.ariaExpanded;
  }
  private updatePanel() {
    this.updateSource.next({ expand: this.ariaExpanded, group: this.groupRow });
  }
  private updatePanelData() {
    this.expansionPanel.instance.data = this.fields;
  }
  private createExpansionPanel(): ComponentRef<RowDetailComponent<BeersSearchResult>> {
    if (!this.expansionFactory) {
      this.expansionFactory = this.createFactory(RowDetailComponent);
    }
    return this.container.createComponent(this.expansionFactory);
  }
  private createFactory<T>(type: Type<T>): ComponentFactory<T> {
    this.container.clear();
    return this.resolver.resolveComponentFactory(type) as ComponentFactory<T>;
  }
  private destroyPanel() {
    if (this.expansionPanel) {
      this.expansionPanel.destroy();
      this.expansionPanel = undefined;
    }
  }

  ngOnDestroy() {
    this.updateSource.complete();
  }
  ngOnInit() {
    this.updateSource.asObservable().subscribe(({ expand, group }) => {
      if (group || expand === false) {
        this.destroyPanel();
      } else {
        if (!this.expansionPanel) {
          this.expansionPanel = this.createExpansionPanel();
        }
        this.updatePanelData();
      }
    });
    this.updatePanel();
  }
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}
}
