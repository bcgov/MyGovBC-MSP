import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpouseInfoComponent } from './spouse-info.component';

describe('SpouseInfoComponent', () => {
  let component: SpouseInfoComponent;
  let fixture: ComponentFixture<SpouseInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpouseInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpouseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
