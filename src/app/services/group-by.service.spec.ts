import { TestBed } from '@angular/core/testing';

import { GroupByService } from './group-by.service';

describe('GroupByService', () => {
  let service: GroupByService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupByService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
