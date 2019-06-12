import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenSubStatusComponent } from './citizen-sub-status.component';

describe('CitizenSubStatusComponent', () => {
  let component: CitizenSubStatusComponent;
  let fixture: ComponentFixture<CitizenSubStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenSubStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenSubStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
