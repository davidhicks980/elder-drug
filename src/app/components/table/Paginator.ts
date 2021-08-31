import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';

export interface Paginator {
  page: Subject<PageEvent>;
  pageIndex: number;
  initialized: Observable<void>;
  pageSize: number;
  length: number;
}
