import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewopComponent } from './newop.component';

describe('NewopComponent', () => {
  let component: NewopComponent;
  let fixture: ComponentFixture<NewopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
