import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ExpandedElementComponent } from '../components/table/expanded-element/expanded-element.component';
import { FlatRowGroup } from '../components/table/RowGroup';
import { TableEntry } from '../components/table/TableEntry';
import { BeersSearchResult } from '../services/search.service';

type Result = Partial<TableEntry<BeersSearchResult> | FlatRowGroup<BeersSearchResult>>;
@Directive({
  selector: '[detailPanel]',
})
export class ExpandableRowDirective implements OnDestroy, OnInit {
  private expanded: boolean = false;
  private updateSource: BehaviorSubject<{ expand: boolean; group: boolean }> = new BehaviorSubject({
    expand: false,
    group: true,
  });
  private groupRow: boolean;
  private fields: BeersSearchResult;
  private expansionFactory: ComponentFactory<ExpandedElementComponent<BeersSearchResult>>;
  private expansionPanel: ComponentRef<ExpandedElementComponent<BeersSearchResult>>;
  private detail: Partial<FlatRowGroup<BeersSearchResult> | TableEntry<BeersSearchResult>>;
  @Input() set detailPanel(detail: Result) {
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
  get detailPanel() {
    return this.detail;
  }
  @Input()
  set detailPanelExpanded(expanded: boolean) {
    if (expanded != this.expanded) {
      this.expanded = expanded;
      this.updatePanel();
    }
  }
  get detailPanelExpanded() {
    return this.expanded;
  }
  private updatePanel() {
    this.updateSource.next({ expand: this.expanded, group: this.groupRow });
  }
  private updatePanelData() {
    this.expansionPanel.instance.data = this.fields;
  }
  private createExpansionPanel(): ComponentRef<ExpandedElementComponent<BeersSearchResult>> {
    if (!this.expansionFactory) {
      this.expansionFactory = this.createFactory(ExpandedElementComponent);
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
