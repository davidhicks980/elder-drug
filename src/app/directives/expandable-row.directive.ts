import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ExpandedElementComponent } from '../components/table/expanded-element/expanded-element.component';
import { FlatRowGroup } from '../components/table/RowGroup';
import { TableEntry } from '../components/table/TableEntry';
import { BeersSearchResult } from '../services/search.service';

type Ref<T> = ComponentRef<T>;
const PLACEHOLDER_POSITION = {
  position: {
    id: '',
    parentId: '',
    isGroup: false,
    hasParent: false,
  },
};
@Directive({
  selector: '[detail]',
})
export class ExpandableRowDirective {
  @Input() set detail(
    detail: Partial<FlatRowGroup<BeersSearchResult> | TableEntry<BeersSearchResult>>
  ) {
    this.dataSource.next(detail);
  }
  @Input('expandDetail') set expandDetail(expanded: boolean) {
    this.togglePanel(expanded);
  }
  private dataSource: BehaviorSubject<
    Partial<FlatRowGroup<BeersSearchResult> | TableEntry<BeersSearchResult>>
  > = new BehaviorSubject(PLACEHOLDER_POSITION);
  private expansionFactory: ComponentFactory<ExpandedElementComponent<BeersSearchResult>>;
  private expansionPanel: ComponentRef<ExpandedElementComponent<BeersSearchResult>>;

  get detail(): Partial<FlatRowGroup<BeersSearchResult> | TableEntry<BeersSearchResult>> {
    return this.dataSource.getValue();
  }
  get isGroupRow() {
    return this.dataSource.value?.position?.isGroup;
  }
  getDetail() {
    return this.dataSource.value;
  }
  togglePanel(expand: boolean) {
    if (!expand || this.isGroupRow) {
      this.destroyPanel(this.expansionPanel);
      this.expansionPanel = undefined;
    } else {
      if (!this.expansionPanel) {
        this.expansionPanel = this.createExpansionPanel();
      }
      this.updatePanelData();
    }
  }
  private updatePanelData() {
    if (!this.isGroupRow) {
      this.expansionPanel.instance.data = (
        this.getDetail() as TableEntry<BeersSearchResult>
      ).fields;
    }
  }
  private createExpansionPanel(): ComponentRef<ExpandedElementComponent<BeersSearchResult>> {
    if (!this.expansionFactory) {
      this.expansionFactory = this.createFactory(ExpandedElementComponent);
    }
    return this.container.createComponent(this.expansionFactory);
  }

  destroyPanel<T>(panel: ComponentRef<T>) {
    if (panel) {
      panel.destroy();
    }
  }
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  createFactory<T>(type: Type<T>): ComponentFactory<T> {
    this.container.clear();
    return this.resolver.resolveComponentFactory(type) as ComponentFactory<T>;
  }
}
