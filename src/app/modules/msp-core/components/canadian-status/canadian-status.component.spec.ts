import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadianStatusComponent, ICanadianStatus } from './canadian-status.component';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

describe('CanadianStatusComponent', () => {
  let component: CanadianStatusComponent<ICanadianStatus>;
  let fixture: ComponentFixture<CanadianStatusComponent<ICanadianStatus>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanadianStatusComponent ],
      imports: [SharedCoreModule, FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanadianStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.person = new MspPerson(Relationship.Applicant);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
