import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ToggleComponent } from './toggle.component';
import { Person } from './person.model';
import { Relationship, StatusInCanada, Activities } from './status-activities-documents';
import { SimpleDate } from './simple-date.interface';

describe('Person Model', () => {
    let instance: Person;
    let applicant: Person;
    let spouse: Person;
    let childUnder19: Person;
    let child19To24: Person;
    let childUnder24: Person;

    beforeEach(() => {
        applicant = new Person(Relationship.Applicant);
        spouse = new Person(Relationship.Spouse);
        childUnder19 = new Person(Relationship.ChildUnder19);
        child19To24 = new Person(Relationship.Child19To24);
        childUnder24 = new Person(Relationship.ChildUnder24);
    });

    it('should create', () => {
        expect(applicant).toBeTruthy();
    });

    it('should clear adoption date when newlyAdopted is set to false', () => {
        expect(applicant).toBeTruthy();
        applicant.newlyAdopted = true;
        applicant.adoptedDate = { year: 2012, month: 1, day: 1 };
        expect(applicant.adoptedDate).toBeTruthy();
        applicant.newlyAdopted = false;
        expect(applicant.adoptedDate).toBe(null);
    });


    it('should convert arrivalToBC date to arrivalToBCSimple', () => {
        applicant.arrivalToBCDay = 1;
        applicant.arrivalToBCMonth = 1;
        applicant.arrivalToBCYear = 1999;
        expect(applicant.arrivalToBCSimple).toEqual({
            year: 1999,
            day: 1,
            month: 1,
        });
    });

    it('should convert arrivalToBCSimple to all the arrivalToBC dates', () => {
        applicant.arrivalToBCSimple = {
            year: 1999,
            day: 1,
            month: 1,
        };
        expect(applicant.arrivalToBCDay).toBe(1);
        expect(applicant.arrivalToBCMonth).toBe(1);
        expect(applicant.arrivalToBCYear).toBe(1999);
    });

    it('should clear the OutOfBC record when the decalartion for being out of BC has been set to false', () => {
        applicant.declarationForOutsideOver30Days = true;
        expect(applicant.outOfBCRecord).toBeDefined();
        applicant.declarationForOutsideOver30Days = false;
        expect(applicant.outOfBCRecord).toBeNull();
    });

    it('should have a full name if first and last name are defined', () => {
        expect(applicant.hasFullName).toBeFalsy();
        applicant.firstName = 'William';
        expect(applicant.hasFullName).toBeFalsy();
        applicant.middleName = 'Henry';
        expect(applicant.hasFullName).toBeFalsy();
        applicant.lastName = 'Gates';
        expect(applicant.hasFullName).toBeTruthy();
        expect(applicant.fullName).toBe('William Henry Gates');
    });
});
