import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveDependentComponent } from './add-remove-dependents.component';

describe('AddRemoveDependentsComponent', () => {
  let component: AddRemoveDependentComponent;
  let fixture: ComponentFixture<AddRemoveDependentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveDependentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveDependentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
