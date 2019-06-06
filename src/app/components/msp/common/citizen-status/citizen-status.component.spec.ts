import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenStatusComponent } from './citizen-status.component';

describe('CitizenStatusComponent', () => {
  let component: CitizenStatusComponent;
  let fixture: ComponentFixture<CitizenStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
