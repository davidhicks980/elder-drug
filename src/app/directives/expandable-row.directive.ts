import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExpandedElementComponent } from '../components/table/expanded-element/expanded-element.component';
import { ExpandingEntry } from '../components/table/ExpandingEntry';
import { GroupRowComponent } from '../components/table/group-row/group-row.component';

type Ref<T> = ComponentRef<T>;
@Directive({
  selector: '[detail]',
})
export class ExpandableRowDirective implements AfterViewInit {
  private _dataSource: BehaviorSubject<Partial<ExpandingEntry>> =
    new BehaviorSubject({
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
    });
  factory: ComponentFactory<unknown>;
  expansionSource = new BehaviorSubject(false);
  expansion$ = this.expansionSource
    .asObservable()
    .pipe(map((expanded) => this.expand(expanded)));
  private _isGroup: boolean = true;

  _resetDetail() {
    this.destroy(this.expansionPanel);
  }
  @Input('detail') set detail(data: string) {
    const data_ = JSON.parse(data) as ExpandingEntry;

    this._isGroup = data_._position.isGroup;
    this._dataSource.next(data_);
  }
  get detail() {
    return JSON.stringify(this._dataSource.value) as string;
  }
  get parsedDetail() {
    return this._dataSource.value;
  }

  get expanded() {
    return this.expansionSource.value;
  }
  @Input('expandDetail') set expandDetail(expanded: boolean) {
    this.expansionSource.next(expanded);
  }
  get expandDetail() {
    return this.expansionSource.value;
  }

  expand(expand) {
    if (!this._isGroup) {
      this.expansionPanel = this.handleExpansionGroup(expand);
      if (this.expansionPanel)
        this.setInternalData(this.expansionPanel.instance);
    } else this.destroy(this.expansionPanel);
    return this.parsedDetail;
  }
  expansionFactory: ComponentFactory<ExpandedElementComponent>;
  expansionPanel: ComponentRef<ExpandedElementComponent> | false;
  groupFactory: ComponentFactory<GroupRowComponent>;
  groupPanel: ComponentRef<GroupRowComponent> | false;

  private setInternalData(panelModel: ExpandedElementComponent) {
    panelModel.data = this.parsedDetail as ExpandingEntry;
  }

  private handleExpansionGroup(expand) {
    if (!this.expansionFactory)
      this.expansionFactory = this.createFactory(ExpandedElementComponent);
    if (!expand) {
      return this.destroy(this.expansionPanel);
    } else return this.createComponent(this.expansionFactory);
  }

  destroy<T>(panel: ComponentRef<T> | false): false {
    if (panel) {
      panel.destroy();
    }
    return false;
  }
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngAfterViewInit() {
    this.expansion$.subscribe((expand) =>
      console.log(expand._position.expanded)
    );
  }
  createComponent<T>(factory: ComponentFactory<T>) {
    let panel;
    if (!this.expansionPanel) panel = this.container.createComponent(factory);
    if (panel.instance['data'])
      panel.instance['data'] = this.parsedDetail as ExpandingEntry;
    return panel as ComponentRef<T>;
  }
  createFactory<T>(type: Type<T>): ComponentFactory<T> {
    this.container.clear();
    return this.resolver.resolveComponentFactory(type) as ComponentFactory<T>;
  }
}
