import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpouseComponent } from './add-spouse.component';

describe('AddSpouseComponent', () => {
  let component: AddSpouseComponent;
  let fixture: ComponentFixture<AddSpouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSpouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
