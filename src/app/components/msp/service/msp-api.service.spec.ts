import {TestBed, inject} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from "@angular/platform-browser";
import {MspLogService} from "./log.service";
import {RouterTestingModule} from "@angular/router/testing";
import {CommonModule} from "@angular/common";
import { CompletenessCheckService } from './completeness-check.service';
import { MspDataService } from './msp-data.service';
import {MspValidationService} from './msp-validation.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from "./msp-api.service";
import { HttpClientModule }    from '@angular/http';

describe('msp-api XML NS', () => {
    let apiService:MspApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [BrowserModule,
                CommonModule,
                HttpClientModule,
                RouterTestingModule,
                FormsModule,
                LocalStorageModule.withConfig({
                    prefix: 'ca.bc.gov.msp',
                    storageType: 'sessionStorage'
                })],
            providers: [
                MspApiService, MspDataService, MspLogService]
        })
    });

    it('validate correction of NS in XML', inject([MspApiService],
        (e:MspApiService) => {

    apiService = e;

    // test data

    let xml1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></application>';

    let xml2 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></ns2:application>';

    let xml3 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:application><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></application>';

    let xml4 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:application xmlns="http://www.w3.org/1999/xhtml"><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></application>';

    let xml5 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application xmlns="http://www.w3.org/1999/xhtml"><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></ns2:application>';

    let xml6 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xx:application xmlns:xx="http://www.w3.org/1999/xhtml"><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></xx:application>';

    let xml7 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><yy:application xmlns="http://www.w3.org/1999/xhtml"><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></yy:application>';

    let correctXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:application xmlns:ns2="http://www.gov.bc.ca/hibc/applicationTypes"><enrolmentApplication><applicant><name><firstName>XXX</firstName><secondName>XXX</secondName><lastName>XXX</lastName></name><gender>F</gender><birthDate>1990-10-24</birthDate><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids><telephone>4031231234</telephone><residenceAddress><addressLine1>12229 Place</addressLine1><city>Ridge</city><postalCode>V2X9H5</postalCode><provinceOrState>British Columbia</provinceOrState><country>Canada</country></residenceAddress><residency><citizenshipStatus><citizenshipType>CanadianCitizen</citizenshipType><attachmentUuids><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachmentUuids></citizenshipStatus><previousCoverage><hasPreviousCoverage>Y</hasPreviousCoverage><prevPHN>9999999998</prevPHN></previousCoverage><livedInBC><hasLivedInBC>N</hasLivedInBC><recentBCMoveDate>2017-12-01</recentBCMoveDate><isPermanentMove>Y</isPermanentMove><prevProvinceOrCountry>Alberta</prevProvinceOrCountry><prevHealthNumber>611111111</prevHealthNumber></livedInBC><outsideBC><beenOutsideBCMoreThan>Y</beenOutsideBCMoreThan><departureDate>2008-10-01</departureDate><returnDate>2017-12-01</returnDate><familyMemberReason>School in Alberta</familyMemberReason><destination>Red Deer</destination></outsideBC><willBeAway><isFullTimeStudent>N</isFullTimeStudent><isInBCafterStudies>N</isInBCafterStudies></willBeAway></residency><authorizedByApplicant>Y</authorizedByApplicant><authorizedByApplicantDate>2018-03-27</authorizedByApplicantDate></applicant></enrolmentApplication><uuid>0670f583-a4ac-0bd3-2c7e-bb1c749d64ac</uuid><attachments><attachment><contentType>image/jpeg</contentType><attachmentDocumentType>SupportDocument</attachmentDocumentType><attachmentUuid>6f36c27d-282f-eebe-f7db-888bc3691bba</attachmentUuid></attachment></attachments></ns2:application>';

    // do the work

    let correctedXml1 = apiService.correctNSinXmlString(xml1);
    console.info ('\n ------- xml1 test ------ \n  -- corrected:\n' + correctedXml1 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml1);

    let correctedXml2 = apiService.correctNSinXmlString(xml2);
    console.info ('\n ------- xml2 test ------ \n  -- corrected:\n' + correctedXml2 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml2);

    let correctedXml3 = apiService.correctNSinXmlString(xml3);
    console.info ('\n ------- xml3 test ------ \n  -- corrected:\n' + correctedXml3 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml3);

    let correctedXml4 = apiService.correctNSinXmlString(xml4);
    console.info ('\n ------- xml4 test ------ \n  -- corrected:\n' + correctedXml4 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml4);

    let correctedXml5 = apiService.correctNSinXmlString(xml5);
    console.info ('\n ------- xml5 test ------ \n  -- corrected:\n' + correctedXml5 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml5);

    let correctedXml6 = apiService.correctNSinXmlString(xml6);
    console.info ('\n ------- xml6 test ------ \n  -- corrected:\n' + correctedXml6 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml6);

    let correctedXml7 = apiService.correctNSinXmlString(xml7);
    console.info ('\n ------- xml7 test ------ \n  -- corrected:\n' + correctedXml7 + '\n  -- expected:\n' + correctXml + '\n  -- initial:\n' + xml7);

    // verify results

    expect(correctedXml1).toEqual(correctXml);
    expect(correctedXml2).toEqual(correctXml);
    expect(correctedXml3).toEqual(correctXml);
    expect(correctedXml4).toEqual(correctXml);
    expect(correctedXml5).toEqual(correctXml);
    expect(correctedXml6).toEqual(correctXml);
    expect(correctedXml7).toEqual(correctXml);

    }));
})
