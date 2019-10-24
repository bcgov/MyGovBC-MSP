import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MovingInformationComponent } from '../../../msp-core/components/moving-information/moving-information.component';
import { Enrollee } from '../../../enrolment/models/enrollee';

describe('MovingInformationComponent', () => {
  let component: MovingInformationComponent<Enrollee>;
  let fixture: ComponentFixture<MovingInformationComponent<Enrollee>>;

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
