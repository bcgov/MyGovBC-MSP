import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildMovingInformationComponent } from './moving-information.component';

describe('MovingInformationComponent', () => {
  let component: MovingInformationComponent;
  let fixture: ComponentFixture<MovingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
