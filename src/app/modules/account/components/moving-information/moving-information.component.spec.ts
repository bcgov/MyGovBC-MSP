import { async, TestBed } from '@angular/core/testing';
import { ChildMovingInformationComponent } from './moving-information.component';
import { Enrollee } from '../../../enrolment/models/enrollee';
import { Relationship } from 'app/models/relationship.enum';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';

fdescribe('ChildMovingInformationComponent', () => {
  let component: ChildMovingInformationComponent;
  let fixture: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildMovingInformationComponent ],
      imports: [
        FormsModule,
        SharedCoreModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildMovingInformationComponent);
    component = fixture.componentInstance;
    component.person = new MspPerson(Relationship.Applicant);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isApplicant', () => {
    it('should return true when relationship is Applicant', () => {
      component.person.relationship = Relationship.Applicant;
      expect(component.isApplicant).toBe(true);
    });

    it('should return false when relationship isn\'t Applicant', () => {
      component.person.relationship = Relationship.Spouse;
      expect(component.isApplicant).toBe(false);
    });
  });

  describe('isSpouse', () => {
    it('should return true when relationship is Spouse', () => {
      component.person.relationship = Relationship.Spouse;
      expect(component.isSpouse).toBe(true);
    });

    it('should return false when relationship isn\'t Spouse', () => {
      component.person.relationship = Relationship.Applicant;
      expect(component.isSpouse).toBe(false);
    });
  });

  describe('isChild', () => {
    it('should return true when relationship is ChildUnder19', () => {
      component.person.relationship = Relationship.ChildUnder19;
      expect(component.isChild).toBe(true);
    });

    it('should return true when relationship is Child19To24', () => {
      component.person.relationship = Relationship.Child19To24;
      expect(component.isChild).toBe(true);
    });

    it('should return false when relationship isn\'t ChildUnder19 or Child19To24', () => {
      component.person.relationship = Relationship.Applicant;
      expect(component.isChild).toBe(false);
    });
  });

  describe('isOveragedChild', () => {
    it('should return true when relationship is Child19To24', () => {
      component.person.relationship = Relationship.Child19To24;
      expect(component.isOveragedChild).toBe(true);
    });

    it('should return false when relationship is ChildUnder19', () => {
      component.person.relationship = Relationship.ChildUnder19;
      expect(component.isOveragedChild).toBe(false);
    });
  });

  describe('isStatus', () => {
    it('should return the CanadianStatusReason', () => {
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.isStatus).toBe(CanadianStatusReason.LivingInBCWithoutMSP);
    });
  });

  describe('isLivedInBCSinceBirth', () => {
    it('should return the true if lived in BC since birth', () => {
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isLivedInBCSinceBirth).toBe(true);
    });

    it('should return the false if haven\'t lived in BC since birth', () => {
      component.person.currentActivity = undefined;
      expect(component.isLivedInBCSinceBirth).toBe(false);
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.isLivedInBCSinceBirth).toBe(false);
    });
  });
});
