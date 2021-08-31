import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'elder-search-buttons',
  templateUrl: './search-buttons.component.html',
  styleUrls: ['./search-buttons.component.scss'],
})
export class SearchButtonsComponent {
  @Output() about: EventEmitter<void> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() edit: EventEmitter<void> = new EventEmitter();
  @Input() showEdit: boolean = false;
  @Input() showAbout: boolean = true;
  emitSearch(event) {
    this.search.emit();
  }
  emitEdit() {
    this.edit.emit();
  }
  emitAbout() {
    this.about.emit();
  }
  constructor() {}
}
