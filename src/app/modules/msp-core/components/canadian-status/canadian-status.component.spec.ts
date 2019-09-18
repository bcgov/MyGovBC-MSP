import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadianStatusComponent } from './canadian-status.component';

describe('CanadianStatusComponent', () => {
  let component: CanadianStatusComponent;
  let fixture: ComponentFixture<CanadianStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanadianStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanadianStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
