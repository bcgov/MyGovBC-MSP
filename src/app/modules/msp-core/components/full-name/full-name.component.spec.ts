import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspFullNameComponent } from './full-name.component';
import { SharedCoreModule } from 'moh-common-lib';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

describe('MspFullNameComponent', () => {
  let component: MspFullNameComponent;
  let fixture: ComponentFixture<MspFullNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MspFullNameComponent ],
      imports: [
        SharedCoreModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MspFullNameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.data = new MspPerson(Relationship.Applicant);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
