import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ExpandedElementComponent } from '../components/table/expanded-element/expanded-element.component';
import { ExpandingEntry } from '../components/table/ExpandingEntry';

type Ref<T> = ComponentRef<T>;
const PLACEHOLDER_POSITION = {
  _position: {
    parentExpanded: false,
    layer: 0,
    root: 0,
    index: 0,
    id: '000',
    parentId: '000',
    isGroup: false,
    hasParent: false,
  },
};
@Directive({
  selector: '[detail]',
})
export class ExpandableRowDirective {
  @Input('detail') set detail(detail: string) {
    const data = JSON.parse(detail) as ExpandingEntry;
    this.isGroup = data._position.isGroup;
    this.dataSource.next(data);
  }
  @Input('expandDetail') set expandDetail(expanded: boolean) {
    this.togglePanel(expanded);
  }
  private dataSource: BehaviorSubject<Partial<ExpandingEntry>> =
    new BehaviorSubject(PLACEHOLDER_POSITION);
  private isGroup: boolean = true;
  private expansionFactory: ComponentFactory<ExpandedElementComponent>;
  private expansionPanel: ComponentRef<ExpandedElementComponent>;

  get detail() {
    return JSON.stringify(this.dataSource.value) as string;
  }

  togglePanel(expand: boolean) {
    if (this.isGroup || !expand) {
      this.destroyPanel(this.expansionPanel);
      this.expansionPanel = undefined;
    } else {
      if (!this.expansionPanel) {
        this.expansionPanel = this.createExpansionPanel();
      }
      this.updatePanelData(this.expansionPanel.instance);
    }
  }
  private updatePanelData(panelModel: ExpandedElementComponent) {
    panelModel.data = this.dataSource.value;
  }
  private createExpansionPanel(): ComponentRef<ExpandedElementComponent> {
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
    private container: ViewContainerRef
  ) {}

  createFactory<T>(type: Type<T>): ComponentFactory<T> {
    this.container.clear();
    return this.resolver.resolveComponentFactory(type) as ComponentFactory<T>;
  }
}
