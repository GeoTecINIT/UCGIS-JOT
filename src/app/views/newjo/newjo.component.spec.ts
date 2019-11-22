import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewjoComponent } from './newjo.component';

describe('NewopComponent', () => {
  let component: NewjoComponent;
  let fixture: ComponentFixture<NewjoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewjoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewjoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
