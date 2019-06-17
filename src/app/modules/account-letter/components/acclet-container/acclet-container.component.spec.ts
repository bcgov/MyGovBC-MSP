import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccletContainerComponent } from './acclet-container.component';

describe('AccletContainerComponent', () => {
  let component: AccletContainerComponent;
  let fixture: ComponentFixture<AccletContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccletContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccletContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
