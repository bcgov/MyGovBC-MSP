import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChildComponent } from './update-child.component';

describe('UpdateChildComponent', () => {
  let component: UpdateChildComponent;
  let fixture: ComponentFixture<UpdateChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
