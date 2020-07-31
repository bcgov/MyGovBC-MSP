import { async, TestBed } from '@angular/core/testing';
import { MovingInformationComponent } from '../../../msp-core/components/moving-information/moving-information.component';
import { Enrollee } from '../../../enrolment/models/enrollee';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';

describe('MovingInformationComponent', () => {
  let component: MovingInformationComponent<Enrollee>;
  let fixture: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingInformationComponent ],
      imports: [
        FormsModule,
        SharedCoreModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingInformationComponent);
    component = fixture.componentInstance;
    component.person = new Enrollee();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
