import { MspPerson } from './msp-person.model';
import { Relationship } from '../../../models/relationship.enum';

describe('Person Model', () => {
    let applicant: MspPerson;
    let spouse: MspPerson;
    let childUnder19: MspPerson;
    let child19To24: MspPerson;
    let childUnder24: MspPerson;

    beforeEach(() => {
        applicant = new MspPerson(Relationship.Applicant);
        spouse = new MspPerson(Relationship.Spouse);
        childUnder19 = new MspPerson(Relationship.ChildUnder19);
        child19To24 = new MspPerson(Relationship.Child19To24);
        childUnder24 = new MspPerson(Relationship.ChildUnder24);
    });

    it('should create', () => {
        expect(applicant).toBeTruthy();
    });

    it('should clear adoption date when newlyAdopted is set to false', () => {
        expect(applicant).toBeTruthy();
        applicant.newlyAdopted = true;
        applicant.adoptedDate = new Date(2012, 1, 1 );
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
