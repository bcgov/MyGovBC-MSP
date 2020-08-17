import { async, TestBed } from '@angular/core/testing';
import { ChildMovingInformationComponent } from './moving-information.component';
import { Enrollee } from '../../../enrolment/models/enrollee';
import { Relationship } from 'app/models/relationship.enum';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { CanadianStatusReason, StatusInCanada } from '../../../msp-core/models/canadian-status.enum';
import { isBefore, subDays, addDays, addMonths, parseISO } from 'date-fns';

describe('ChildMovingInformationComponent', () => {
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
    it('should return true if lived in BC since birth', () => {
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isLivedInBCSinceBirth).toBe(true);
    });

    it('should return false if haven\'t lived in BC since birth', () => {
      component.person.currentActivity = undefined;
      expect(component.isLivedInBCSinceBirth).toBe(false);
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.isLivedInBCSinceBirth).toBe(false);
    });
  });

  describe('isCanadianFromProv', () => {
    it('should return true if is Canadian citizen and moving from province.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isCanadianFromProv).toBe(true);
    });

    it('should return false if not Canadian citizen or not moving from province.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isCanadianFromProv).toBe(false);
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.isCanadianFromProv).toBe(false);
    });
  });

  describe('isCanadianFromCountry', () => {
    it('should return true if is Canadian citizen and moving from country.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.isCanadianFromCountry).toBe(true);
    });

    it('should return false if not Canadian citizen or not moving from country.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isCanadianFromCountry).toBe(false);
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.Visiting;
      expect(component.isCanadianFromCountry).toBe(false);
    });
  });

  describe('isCanadianNotBC', () => {
    it('should return true if is Canadian citizen.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      expect(component.isCanadianNotBC).toBe(true);
    });

    it('should return false if not Canadian citizen.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      expect(component.isCanadianNotBC).toBe(false);
    });
  });

  describe('isResidentFromProv', () => {
    it('should return true if is Permanent Resident and moving from province.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isResidentFromProv).toBe(true);
    });

    it('should return false if not Permanent Resident or not moving from province.', () => {
      component.person.status = StatusInCanada.TemporaryResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.isResidentFromProv).toBe(false);
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.Visiting;
      expect(component.isResidentFromProv).toBe(false);
    });
  });

  describe('isResidentFromCountry', () => {
    it('should return true if is Permanent Resident and moving from province.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.isResidentFromCountry).toBe(true);
    });

    it('should return false if not Permanent Resident or not moving from province.', () => {
      component.person.status = StatusInCanada.TemporaryResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.isResidentFromCountry).toBe(false);
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.Visiting;
      expect(component.isResidentFromCountry).toBe(false);
    });
  });

  describe('isResidentNotBC', () => {
    it('should return true if is Permanent Resident and Living In BC Without MSP.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.isResidentNotBC).toBe(true);
    });

    it('should return false if not Permanent Resident or not Living In BC Without MSP.', () => {
      component.person.status = StatusInCanada.TemporaryResident;
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.isResidentNotBC).toBe(false);
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.Visiting;
      expect(component.isResidentNotBC).toBe(false);
    });
  });

  describe('isTemporaryResident', () => {
    it('should return true if is Temporary Resident.', () => {
      component.person.status = StatusInCanada.TemporaryResident;
      expect(component.isTemporaryResident).toBe(true);
    });

    it('should return false if not Temporary Resident.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      expect(component.isTemporaryResident).toBe(false);
    });
  });

  describe('requestSchoolInfo', () => {
    it('should return true if should request school info.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      expect(component.requestSchoolInfo).toBe(true);
    });

    it('should return false if should not request school info.', () => {
      expect(component.requestSchoolInfo).toBe(false);
    });
  });

  describe('requestPermMoveInfo', () => {
    it('should return true if should request permanent move info.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.livedInBCSinceBirth = true;
      expect(component.requestPermMoveInfo).toBe(true);
    });

    it('should return false if should not request permanent move info.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.livedInBCSinceBirth = false;
      expect(component.requestPermMoveInfo).toBe(false);
    });
  });

  describe('arrivalDateRequired', () => {
    it('should return true if arrival date is required.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.arrivalDateRequired).toBe(true);
    });

    it('should return false if arrival date is not required.', () => {
      expect(component.arrivalDateRequired).toBe(false);
    });
  });

  describe('requestAdditionalMoveInfo', () => {
    it('should return true if need to request additional move info.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.livedInBCSinceBirth = true;
      expect(component.requestAdditionalMoveInfo).toBe(true);
    });

    it('should return false if don\'t need to request additional move info.', () => {
      expect(component.requestAdditionalMoveInfo).toBe(false);
    });
  });

  describe('possessiveRelationshipNoun', () => {
    it('should return "you" if relationship is Applicant.', () => {
      component.person.relationship = Relationship.Applicant;
      expect(component.possessiveRelationshipNoun).toBe('you');
    });

    it('should return "your spouse" if relationship is Spouse.', () => {
      component.person.relationship = Relationship.Spouse;
      expect(component.possessiveRelationshipNoun).toBe('your spouse');
    });

    it('should return "this child" for all other cases.', () => {
      component.person.relationship = Relationship.ChildUnder19;
      expect(component.possessiveRelationshipNoun).toBe('this child');
    });
  });

  describe('showlivedInBC', () => {
    it('should return true if status is Canadian citizen.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      expect(component.showlivedInBC).toBe(true);
    });

    it('should return false if status isn\'t Canadian citizen.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      expect(component.showlivedInBC).toBe(false);
    });
  });

  describe('showRecentMove', () => {
    it('should return true if should show recent move.', () => {
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      component.person.livedInBCSinceBirth = false;
      expect(component.showRecentMove).toBe(true);
    });

    it('should return true if should show recent move.', () => {
      component.person.relationship = Relationship.ChildUnder19;
      component.person.livedInBCSinceBirth = false;
      expect(component.showRecentMove).toBe(true);
    });

    it('should return true if should not show recent move.', () => {
      expect(component.showRecentMove).toBe(false);
    });
  });

  describe('showFromProv', () => {
    it('should return false if is child.', () => {
      component.person.relationship = Relationship.ChildUnder19;
      expect(component.showFromProv).toBe(false);
    });

    it('should return true if Canadian citizen and moving from province.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.showFromProv).toBe(true);
    });

    it('should return true if Canadian citizen and living in BC without MSP.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.showFromProv).toBe(true);
    });

    it('should return true if permanent resident and moving from province.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.showFromProv).toBe(true);
    });
  });

  describe('showFromCountry', () => {
    it('should return false if is child.', () => {
      component.person.relationship = Relationship.ChildUnder19;
      expect(component.showFromCountry).toBe(false);
    });

    it('should return true if Canadian citizen and moving from country.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.showFromCountry).toBe(true);
    });

    it('should return true if permanent resident and moving from country.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromCountry;
      expect(component.showFromCountry).toBe(true);
    });

    it('should return true if temporary resident.', () => {
      component.person.status = StatusInCanada.TemporaryResident;
      expect(component.showFromCountry).toBe(true);
    });
  });

  describe('showHealthNumber', () => {
    it('should return true if is child.', () => {
      component.person.relationship = Relationship.ChildUnder19;
      expect(component.showHealthNumber).toBe(true);
    });

    it('should return true if Canadian citizen and moving from country.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.showHealthNumber).toBe(true);
    });

    it('should return true if Canadian citizen and living in BC without MSP.', () => {
      component.person.status = StatusInCanada.CitizenAdult;
      component.person.currentActivity = CanadianStatusReason.LivingInBCWithoutMSP;
      expect(component.showHealthNumber).toBe(true);
    });

    it('should return true if permanent resident and moving from province.', () => {
      component.person.status = StatusInCanada.PermanentResident;
      component.person.currentActivity = CanadianStatusReason.MovingFromProvince;
      expect(component.showHealthNumber).toBe(true);
    });
  });

  describe('hasBeenReleasedFromArmedForces getter', () => {
    it('should return true if has been released from armed forces.', () => {
      component.person.hasBeenReleasedFromArmedForces = true;
      expect(component.hasBeenReleasedFromArmedForces).toBe(true);
    });

    it('should return false if not has been released from armed forces.', () => {
      component.person.hasBeenReleasedFromArmedForces = false;
      expect(component.hasBeenReleasedFromArmedForces).toBe(false);
    });
  });

  describe('hasBeenReleasedFromArmedForces setter', () => {
    it('should set value of `hasBeenReleasedFromArmedForces`.', () => {
      component.person.hasBeenReleasedFromArmedForces = true;
      component.hasBeenReleasedFromArmedForces = false;
      expect(component.person.hasBeenReleasedFromArmedForces).toBe(false);
    });
  });

  describe('setDeclarationForOutsideOver60Days', () => {
    it('should set value of `declarationForOutsideOver60Days`.', () => {
      component.person.declarationForOutsideOver60Days = false;
      component.setDeclarationForOutsideOver60Days(true);
      expect(component.person.declarationForOutsideOver60Days).toBe(true);
    });

    it('should reset value of `departureReason` and `departureDestination` when false.', () => {
      component.person.declarationForOutsideOver60Days = true;
      component.person.departureReason = 'TEST';
      component.person.departureDestination = 'TEST';
      component.setDeclarationForOutsideOver60Days(false);
      expect(component.person.departureReason).toBe(null);
      expect(component.person.departureDestination).toBe(null);
    });
  });

  describe('dob', () => {
    it('should return the `dob`.', () => {
      component.person.dob = new Date('2020-04-01');
      expect(component.dob).toBe(component.person.dob);
    });
  });

  describe('adoptedDate', () => {
    it('should return the `adoptedDate`.', () => {
      component.person.adoptedDate = new Date('2020-04-01');
      expect(component.adoptedDate).toBe(component.person.adoptedDate);
    });
  });

  describe('arrivalToBCDate', () => {
    it('should return the `arrivalToBCDate`.', () => {
      component.person.arrivalToBCDate = new Date('2020-04-01');
      expect(component.arrivalToBCDate).toBe(component.person.arrivalToBCDate);
    });
  });

  describe('departureDateDuring12MonthsDate', () => {
    it('should return the `departureDateDuring12MonthsDate`.', () => {
      component.person.departureDateDuring12MonthsDate = new Date('2020-04-01');
      expect(component.departureDateDuring12MonthsDate).toBe(component.person.departureDateDuring12MonthsDate);
    });
  });

  describe('returnDateDuring12MonthsDate', () => {
    it('should return the `returnDateDuring12MonthsDate`.', () => {
      component.person.returnDateDuring12MonthsDate = new Date('2020-04-01');
      expect(component.returnDateDuring12MonthsDate).toBe(component.person.returnDateDuring12MonthsDate);
    });
  });

  describe('departureDateDuring6MonthsDate', () => {
    it('should return the `departureDateDuring6MonthsDate`.', () => {
      component.person.departureDateDuring6MonthsDate = new Date('2020-04-01');
      expect(component.departureDateDuring6MonthsDate).toBe(component.person.departureDateDuring6MonthsDate);
    });
  });

  describe('returnDateDuring6MonthsDate', () => {
    it('should return the `returnDateDuring6MonthsDate`.', () => {
      component.person.returnDateDuring6MonthsDate = new Date('2020-04-01');
      expect(component.returnDateDuring6MonthsDate).toBe(component.person.returnDateDuring6MonthsDate);
    });
  });

  describe('studiesDepartureDate', () => {
    it('should return the `studiesDepartureDate`.', () => {
      component.person.studiesDepartureDate = new Date('2020-04-01');
      expect(component.studiesDepartureDate).toBe(component.person.studiesDepartureDate);
    });
  });

  describe('studiesBeginDate', () => {
    it('should return the `studiesBeginDate`.', () => {
      component.person.studiesBeginDate = new Date('2020-04-01');
      expect(component.studiesBeginDate).toBe(component.person.studiesBeginDate);
    });
  });

  describe('studiesFinishedDate', () => {
    it('should return the `studiesFinishedDate`.', () => {
      component.person.studiesFinishedDate = new Date('2020-04-01');
      expect(component.studiesFinishedDate).toBe(component.person.studiesFinishedDate);
    });
  });

  describe('dischargeDate', () => {
    it('should return the `dischargeDate`.', () => {
      component.person.dischargeDate = new Date('2020-04-01');
      expect(component.dischargeDate).toBe(component.person.dischargeDate);
    });
  });

  describe('arrivalToBCStartRange', () => {
    it('should return the `dob`.', () => {
      const fakeDate = new Date('2020-04-01');
      spyOnProperty(component, 'dob').and.returnValue(fakeDate);
      expect(component.arrivalToBCStartRange).toBe(fakeDate);
    });
  });

  describe('arrivalToBCEndRange', () => {
    it('should return date today when `departureDateDuring12MonthsDate` isn\'t defined', () => {
      const fakeDate = new Date('2020-04-01');
      component.dateToday = fakeDate;
      expect(component.arrivalToBCEndRange).toBe(fakeDate);
    });

    it('should return `departureDateDuring12MonthsDate` when it is before `arrivalToBCDate`.', () => {
      const fakeDate = new Date('2020-04-01');
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDate);
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(new Date('2020-05-01'));
      expect(component.arrivalToBCEndRange).toBe(fakeDate);
    });

    it('should return `departureDateDuring12MonthsDate` when it is after `arrivalToBCDate`.', () => {
      const fakeDate = new Date('2020-04-01');
      const fakeToday = new Date('2020-04-01');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDate);
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(new Date('2020-03-01'));
      expect(component.arrivalToBCEndRange).toBe(fakeToday);
    });
  });

  describe('departureDateDuring12MonthsStartRange', () => {
    it('should return `dob` when `arrivalToBCDate` is before it.', () => {
      const fakeDob = new Date('2020-04-01');
      const fakeArrivalDate = new Date('2020-03-01')
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.departureDateDuring12MonthsStartRange).toBe(fakeDob);
    });

    it('should return `arrivalToBCDate` when it is after `dob`.', () => {
      const fakeDob = new Date('2020-04-01');
      const fakeArrivalDate = new Date('2020-05-01')
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.departureDateDuring12MonthsStartRange).toBe(fakeArrivalDate);
    });

    it('should return `arrivalToBCDate` when `dob` isn\'t defined.', () => {
      const fakeArrivalDate = new Date('2020-05-01')
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      expect(component.departureDateDuring12MonthsStartRange).toBe(fakeArrivalDate);
    });

    it('should return `dob` when `arrivalToBCDate` isn\'t defined.', () => {
      const fakeDobDate = new Date('2020-05-01')
      spyOnProperty(component, 'dob').and.returnValue(fakeDobDate);
      expect(component.departureDateDuring12MonthsStartRange).toBe(fakeDobDate);
    });
  });

  describe('departureDateDuring12MonthsEndRange', () => {
    it('should return date 30 days prior to today.', () => {
      const fakeToday = parseISO('2020-04-01');
      const expectedDate = parseISO('2020-03-02');
      component.dateToday = fakeToday;
      expect(component.departureDateDuring12MonthsEndRange).toEqual(expectedDate);
    });
  });

  describe('returnDateDuring12MonthsStartRange', () => {
    it('should return date today when today is before return date.', () => {
      const fakeToday = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-03-01');
      const fakeReturnDate = parseISO('2020-05-01');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      spyOnProperty(component, 'returnDateDuring12MonthsDate').and.returnValue(fakeReturnDate);
      expect(component.returnDateDuring12MonthsStartRange).toEqual(fakeToday);
    });

    it('should return departure date plus 30 days when today is after return date.', () => {
      const fakeToday = parseISO('2020-06-01');
      const fakeDepartureDate = parseISO('2020-03-01');
      const fakeReturnDate = parseISO('2020-05-01');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      spyOnProperty(component, 'returnDateDuring12MonthsDate').and.returnValue(fakeReturnDate);
      expect(component.returnDateDuring12MonthsStartRange).toEqual(parseISO('2020-03-31'));
    });

    it('should return date today when `departureDateDuring12MonthsDate` isn\'t defined.', () => {
      const fakeToday = parseISO('2020-06-01');
      component.dateToday = fakeToday;
      expect(component.returnDateDuring12MonthsStartRange).toEqual(fakeToday);
    });
  });

  describe('departureDateDuring6MonthsStartRange', () => {
    it('should return date today.', () => {
      const fakeToday = parseISO('2020-04-01');
      component.dateToday = fakeToday;
      expect(component.departureDateDuring6MonthsStartRange).toEqual(fakeToday);
    });
  });

  describe('departureDateDuring6MonthsEndRange', () => {
    it('should return date today when today is 30 days before return date.', () => {
      const fakeToday = parseISO('2020-04-01');
      const fakeReturnDate = parseISO('2020-02-01');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'returnDateDuring6MonthsDate').and.returnValue(fakeReturnDate);
      expect(component.departureDateDuring6MonthsEndRange).toEqual(fakeToday);
    });

    it('should return 30 days minus return date when today is less than 30 days before return date.', () => {
      const fakeToday = parseISO('2020-04-01');
      const fakeReturnDate = parseISO('2020-05-15');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'returnDateDuring6MonthsDate').and.returnValue(fakeReturnDate);
      expect(component.departureDateDuring6MonthsEndRange).toEqual(parseISO('2020-04-15'));
    });

    it('should return 5 months minus date today when return date isn\'t defined.', () => {
      const fakeToday = parseISO('2020-04-01');
      component.dateToday = fakeToday;
      expect(component.departureDateDuring6MonthsEndRange).toEqual(parseISO('2020-09-01'));
    });
  });

  describe('returnDateDuring6MonthsStartRange', () => {
    it('should return date today plus 30 days when date today is before departure date.', () => {
      const fakeToday = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-04-15');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.returnDateDuring6MonthsStartRange).toEqual(parseISO('2020-05-01'));
    });

    it('should return departure date plus 30 days when today is after departure.', () => {
      const fakeToday = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-03-15');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.returnDateDuring6MonthsStartRange).toEqual(parseISO('2020-04-14'));
    });

    it('should return today plus 30 days when departure date isn\'t defined', () => {
      const fakeToday = parseISO('2020-04-01');
      component.dateToday = fakeToday;
      expect(component.returnDateDuring6MonthsStartRange).toEqual(parseISO('2020-05-01'));
    });
  });

  describe('studiesDepartureDateStartRange', () => {
    it('should return date today plus 30 days when date today is before departure date.', () => {
      const fakeArrivalDate = parseISO('2020-04-01');
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      expect(component.studiesDepartureDateStartRange).toBe(fakeArrivalDate);
    });

    it('should return today plus 30 days when departure date isn\'t defined', () => {
      const fakeDob = parseISO('2020-04-01');
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.studiesDepartureDateStartRange).toBe(fakeDob);
    });
  });
  
  describe('studiesDepartureDateEndRange', () => {
    it('should return studies begin date when it\'s before date today.', () => {
      const fakeBeginDate = parseISO('2020-03-01');
      component.dateToday = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      expect(component.studiesDepartureDateEndRange).toBe(fakeBeginDate);
    });

    it('should return date today minus 1 day when studies begin date is after date today.', () => {
      const fakeBeginDate = parseISO('2020-05-01');
      component.dateToday = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      expect(component.studiesDepartureDateEndRange).toEqual(parseISO('2020-03-31'));
    });

    it('should return date today minus 1 day when studies begin date isn\'t defined.', () => {
      component.dateToday = parseISO('2020-04-01');
      expect(component.studiesDepartureDateEndRange).toEqual(parseISO('2020-03-31'));
    });
  });

  describe('studiesBeginDateStartRange', () => {
    it('should return departure date when dob is before departure date.', () => {
      const fakeDepartureDate = parseISO('2020-03-01');
      const fakeDob = parseISO('2020-02-01');
      spyOnProperty(component, 'studiesDepartureDate').and.returnValue(fakeDepartureDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.studiesBeginDateStartRange).toBe(fakeDepartureDate);
    });

    it('should return dob when departure date isn\'t defined.', () => {
      const fakeDob = parseISO('2020-05-01');
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.studiesBeginDateStartRange).toBe(fakeDob);
    });
  });

  describe('studiesBeginDateEndRange', () => {
    it('should return departure date when dob is before departure date.', () => {
      const fakeFinishedDate = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesFinishedDate').and.returnValue(fakeFinishedDate);
      expect(component.studiesBeginDateEndRange).toBe(fakeFinishedDate);
    });

    it('should return null when `studiesFinishedDate` isn\'t defined.', () => {
      expect(component.studiesBeginDateEndRange).toBe(null);
    });
  });

  describe('studiesFinishedDateStartRange', () => {
    it('should return `studiesBeginDate` when is after date today.', () => {
      const fakeBeginDate = parseISO('2020-04-01');
      component.dateToday = parseISO('2020-03-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      expect(component.studiesFinishedDateStartRange).toBe(fakeBeginDate);
    });

    it('should return date today when `studiesBeginDate` is before date today.', () => {
      const fakeBeginDate = parseISO('2020-04-01');
      const fakeToday = parseISO('2020-05-01');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      expect(component.studiesFinishedDateStartRange).toBe(fakeToday);
    });
  });

  describe('studiesFinishedDateEndRange', () => {
    it('should return null.', () => {
      expect(component.studiesFinishedDateEndRange).toBe(null);
    });
  });

  describe('dischargeDateStartRange', () => {
    it('should return `dob`.', () => {
      const fakeDob = parseISO('2020-04-01');
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.dischargeDateStartRange).toBe(fakeDob);
    });
  });

  describe('dischargeDateEndRange', () => {
    it('should return null.', () => {
      expect(component.dischargeDateEndRange).toBe(null);
    });
  });

  describe('adoptionDateErrorMessage', () => {
    it('should return \'Date cannot be in the future\' when adopted date is after date today.', () => {
      const fakeToday = parseISO('2020-04-01');
      const fakeAdoptedDate = parseISO('2020-05-01');
      component.dateToday = fakeToday;
      spyOnProperty(component, 'adoptedDate').and.returnValue(fakeAdoptedDate);
      expect(component.adoptionDateErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the future.'
      });
    });

    it('should return \'Date must be after birthdate\' when adopted date is before `dob`.', () => {
      const fakeAdoptedDate = parseISO('2020-05-01');
      const fakeDob = parseISO('2020-06-01');
      spyOnProperty(component, 'adoptedDate').and.returnValue(fakeAdoptedDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.adoptionDateErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range\' for all other cases.', () => {
      expect(component.adoptionDateErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('mostRecentMoveToBCErrorMessage', () => {
    it('should return \'Date must be before any date of departure from BC\' when departure date is before arrival date.', () => {
      const fakeArrivalDate = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-03-01');
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      expect(component.mostRecentMoveToBCErrorMessage).toEqual({
        invalidRange: 'Date must be before any date of departure from BC.'
      });
    });

    it('should return \'Date cannot be in the future\' when arrival date is after date today.', () => {
      const fakeDateToday = parseISO('2020-04-01');
      const fakeArrivalDate = parseISO('2020-05-01');
      component.dateToday = fakeDateToday;
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      expect(component.mostRecentMoveToBCErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the future.'
      });
    });

    it('should return \'Date must be after birthdate\' when arrival date is before dob.', () => {
      const fakeArrivalDate = parseISO('2020-04-01');
      const fakeDob = parseISO('2020-05-01');
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.mostRecentMoveToBCErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range\' for all other cases.', () => {
      expect(component.mostRecentMoveToBCErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('departureDate12MonthsErrorMessage', () => {
    it('should return \'Date must be after arrival in BC\' when departure date is before arrival date.', () => {
      const fakeArrivalDate = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-03-01');
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      expect(component.departureDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be after arrival in BC.'
      });
    });

    it('should return \'Date cannot be in the future\' when departure date is after date today.', () => {
      const fakeDepartureDate = parseISO('2020-05-01');
      component.dateToday = parseISO('2020-04-01');
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.departureDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the future.'
      });
    });

    it('should return \'Date must be after birthdate\' when departure date is before arrival date.', () => {
      const fakeDob = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-03-01');
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.departureDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range\' for all other cases.', () => {
      expect(component.departureDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('returnDate12MonthsErrorMessage', () => {
    it('should return \'Date cannot be in the future\' when return date is after date today.', () => {
      const fakeDateToday = parseISO('2020-04-01');
      const fakeReturnDate = parseISO('2020-05-01');
      component.dateToday = fakeDateToday;
      spyOnProperty(component, 'returnDateDuring12MonthsDate').and.returnValue(fakeReturnDate);
      expect(component.returnDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the future.'
      });
    });

    it('should return \'Date must be more than 30 days after departure\' when return date is before 30 days less departure date.', () => {
      const fakeDepartureDate = parseISO('2020-04-01');
      const fakeReturnDate = parseISO('2020-03-01');
      spyOnProperty(component, 'returnDateDuring12MonthsDate').and.returnValue(fakeReturnDate);
      spyOnProperty(component, 'departureDateDuring12MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.returnDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be more than 30 days after departure.'
      });
    });

    it('should return \'Date must be after birthdate\' when return date is before dob.', () => {
      const fakeDob = parseISO('2020-04-01');
      const fakeReturnDate = parseISO('2020-03-01');
      spyOnProperty(component, 'returnDateDuring12MonthsDate').and.returnValue(fakeReturnDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.returnDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range\' for all other cases.', () => {
      expect(component.returnDate12MonthsErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('departureDate6MonthsErrorMessage', () => {
    it('should return \'Date must be more than 30 days before return date.\' when return date is 30 days after departure date.', () => {
      const fakeReturnDate = parseISO('2020-05-01');
      const fakeDepartureDate = parseISO('2020-05-01');
      spyOnProperty(component, 'returnDateDuring6MonthsDate').and.returnValue(fakeReturnDate);
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.departureDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be more than 30 days before return date.'
      });
    });

    it('should return \'Date cannot be in the past.\' when return date is before date today.', () => {
      const fakeDateToday = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-03-01');
      component.dateToday = fakeDateToday;
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.departureDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the past.'
      });
    });

    it('should return \'Date must be within the next six months.\' when departure date isn\'t 6 months in the future.', () => {
      const fakeDateToday = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-12-01');
      component.dateToday = fakeDateToday;
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.departureDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be within the next six months.'
      });
    });

    it('should return \'Date must be after birthdate.\' when departure date is before dob.', () => {
      const fakeDob = parseISO('2020-05-01');
      const fakeDepartureDate = parseISO('2020-04-01');
      component.dateToday = null;
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.departureDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range.\' for all other cases.', () => {
      expect(component.departureDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('returnDate6MonthsErrorMessage', () => {
    it('should return \'Date must be more than 30 days after departure.\' when return date is 30 days before departure date.', () => {
      const fakeReturnDate = parseISO('2020-05-01');
      const fakeDepartureDate = parseISO('2020-05-01');
      spyOnProperty(component, 'returnDateDuring6MonthsDate').and.returnValue(fakeReturnDate);
      spyOnProperty(component, 'departureDateDuring6MonthsDate').and.returnValue(fakeDepartureDate);
      expect(component.returnDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Date must be more than 30 days after departure.'
      });
    });

    it('should return \'Date cannot be in the past.\' when return date is 30 days before departure date.', () => {
      const fakeReturnDate = parseISO('2020-04-01');
      const fakeTodayDate = parseISO('2020-05-01');
      component.dateToday = fakeTodayDate;
      spyOnProperty(component, 'returnDateDuring6MonthsDate').and.returnValue(fakeReturnDate);
      expect(component.returnDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the past.'
      });
    });

    it('should return \'Invalid date range.\' for all other cases.', () => {
      expect(component.returnDate6MonthsErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('studiesDepartureDateErrorMessage', () => {
    it('should return \'Date must be after arrival in BC.\' when departure date is before arrival date.', () => {
      const fakeArrivalDate = parseISO('2020-05-01');
      const fakeDepartureDate = parseISO('2020-04-01');
      spyOnProperty(component, 'arrivalToBCDate').and.returnValue(fakeArrivalDate);
      spyOnProperty(component, 'studiesDepartureDate').and.returnValue(fakeDepartureDate);
      expect(component.studiesDepartureDateErrorMessage).toEqual({
        invalidRange: 'Date must be after arrival in BC.'
      });
    });

    it('should return \'Date cannot be in the future.\' when departure date is before date today.', () => {
      const fakeDateToday = parseISO('2020-04-01');
      const fakeDepartureDate = parseISO('2020-05-01');
      component.dateToday = fakeDateToday;
      spyOnProperty(component, 'studiesDepartureDate').and.returnValue(fakeDepartureDate);
      expect(component.studiesDepartureDateErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the future.'
      });
    });

    it('should return \'Date must be after birthdate.\' when departure date is before dob.', () => {
      const fakeDob = parseISO('2020-05-01');
      const fakeDepartureDate = parseISO('2020-04-01');
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      spyOnProperty(component, 'studiesDepartureDate').and.returnValue(fakeDepartureDate);
      expect(component.studiesDepartureDateErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Date must be prior to school beginning.\' when studies begin date is before departure date.', () => {
      const fakeBeginDate = parseISO('2020-03-01');
      const fakeDepartureDate = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      spyOnProperty(component, 'studiesDepartureDate').and.returnValue(fakeDepartureDate);
      expect(component.studiesDepartureDateErrorMessage).toEqual({
        invalidRange: 'Date must be prior to school beginning.'
      });
    });

    it('should return \'Invalid date range.\' for all other cases.', () => {
      expect(component.studiesDepartureDateErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('studiesBeginDateErrorMessage', () => {
    it('should return \'Date must be after departure to school.\' when begin date is before departure date.', () => {
      const fakeBeginDate = parseISO('2020-03-01');
      const fakeDepartureDate = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      spyOnProperty(component, 'studiesDepartureDate').and.returnValue(fakeDepartureDate);
      expect(component.studiesBeginDateErrorMessage).toEqual({
        invalidRange: 'Date must be after departure to school.'
      });
    });

    it('should return \'Date must be prior to finish date.\' when begin date is after finish date.', () => {
      const fakeBeginDate = parseISO('2020-05-01');
      const fakeFinishDate = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      spyOnProperty(component, 'studiesFinishedDate').and.returnValue(fakeFinishDate);
      expect(component.studiesBeginDateErrorMessage).toEqual({
        invalidRange: 'Date must be prior to finish date.'
      });
    });

    it('should return \'Date must be after birthdate.\' when begin date is before dob.', () => {
      const fakeBeginDate = parseISO('2020-03-01');
      const fakeDob = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.studiesBeginDateErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range.\' for all other cases.', () => {
      expect(component.studiesBeginDateErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('studiesFinishedDateErrorMessage', () => {
    it('should return \'Date must be after date studies begin.\' when finish date is before begin date.', () => {
      const fakeBeginDate = parseISO('2020-05-01');
      const fakeFinishDate = parseISO('2020-04-01');
      spyOnProperty(component, 'studiesBeginDate').and.returnValue(fakeBeginDate);
      spyOnProperty(component, 'studiesFinishedDate').and.returnValue(fakeFinishDate);
      expect(component.studiesFinishedDateErrorMessage).toEqual({
        invalidRange: 'Date must be after date studies begin.'
      });
    });

    it('should return \'Date cannot be in the past.\' when finish date is before date today.', () => {
      const fakeDateToday = parseISO('2020-05-01');
      const fakeFinishDate = parseISO('2020-04-01');
      component.dateToday = fakeDateToday;
      spyOnProperty(component, 'studiesFinishedDate').and.returnValue(fakeFinishDate);
      expect(component.studiesFinishedDateErrorMessage).toEqual({
        invalidRange: 'Date cannot be in the past.'
      });
    });

    it('should return \'Date must be after birthdate.\' when finish date is before dob.', () => {
      const fakeDob = parseISO('2020-05-01');
      const fakeFinishDate = parseISO('2020-04-01');
      component.dateToday = null;
      spyOnProperty(component, 'studiesFinishedDate').and.returnValue(fakeFinishDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.studiesFinishedDateErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range.\' for all other cases.', () => {
      expect(component.studiesFinishedDateErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });

  describe('dischargeDateErrorMessage', () => {
    it('should return \'Date must be after birthdate.\' when discharge date is before dob.', () => {
      const fakeDischargeDate = parseISO('2020-03-01');
      const fakeDob = parseISO('2020-04-01');
      spyOnProperty(component, 'dischargeDate').and.returnValue(fakeDischargeDate);
      spyOnProperty(component, 'dob').and.returnValue(fakeDob);
      expect(component.dischargeDateErrorMessage).toEqual({
        invalidRange: 'Date must be after birthdate.'
      });
    });

    it('should return \'Invalid date range.\' for all other cases.', () => {
      expect(component.dischargeDateErrorMessage).toEqual({
        invalidRange: 'Invalid date range.'
      });
    });
  });
});
