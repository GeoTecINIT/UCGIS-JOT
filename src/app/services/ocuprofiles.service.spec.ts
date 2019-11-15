import { TestBed } from '@angular/core/testing';

import { OcuprofilesService } from './ocuprofiles.service';

describe('OcuprofilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OcuprofilesService = TestBed.get(OcuprofilesService);
    expect(service).toBeTruthy();
  });
});
