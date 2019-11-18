import { TestBed } from '@angular/core/testing';

import { JobofferService } from './joboffer.service';

describe('JobofferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobofferService = TestBed.get(JobofferService);
    expect(service).toBeTruthy();
  });
});
