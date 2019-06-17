import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolContainerComponent } from './enrol-container.component';

describe('EnrolContainerComponent', () => {
  let component: EnrolContainerComponent;
  let fixture: ComponentFixture<EnrolContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
