import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MspToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  let component: MspToggleComponent;
  let fixture: ComponentFixture<MspToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MspToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MspToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no selection by defalt', () => {
    expect(component.data).toBeUndefined();
  });

  it('should be invalid when selection is undefined', () => {
    expect(component.isValid()).toBeFalsy();
  });

  it('should be valid when selection is true', () => {
    component.data = true;
    expect(component.isValid()).toBeTruthy();
  });
  it('should be valid when selection is false', () => {
    component.data = false;
    expect(component.isValid()).toBeTruthy();
  });
  it('should be invalid when selection is null', () => {
    component.data = null;
    expect(component.isValid()).toBeFalsy();
  });
});
