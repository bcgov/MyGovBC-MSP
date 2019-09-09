import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveChildComponent } from './remove-child.component';

describe('RemoveChildComponent', () => {
  let component: RemoveChildComponent;
  let fixture: ComponentFixture<RemoveChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
