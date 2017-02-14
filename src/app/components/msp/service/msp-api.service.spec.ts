import {TestBed, fakeAsync, inject} from '@angular/core/testing';
import {MspApiService} from "./msp-api.service";
import {MspApplication} from "../model/application.model";
import {Gender, Person} from "../model/person.model";
import {MspImage} from "../model/msp-image";
import {StatusInCanada, Activities, Relationship} from "../model/status-activities-documents";
import {HttpModule} from "@angular/http";
import appConstants from '../../../services/appConstants';
import {Data} from "./test/image.data";
import {FinancialAssistApplication} from "../model/financial-assist-application.model";
import {ApplicationBase} from "../model/application-base.model";
import {AssistanceYear} from "../model/assistance-year.model";

describe('MspApiService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {provide: 'appConstants', useValue: appConstants},
        MspApiService
      ]
    })
  });

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  it('should be defined', () => {
    let service = TestBed.get(MspApiService);
    expect(service).toBeDefined();
  });
  it('should convert something simple', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    expect(service.convertMspApplication(app)).toBeDefined();
  });
  it('should display some JSON', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "First Name";
    let applicationType = service.convertMspApplication(app);
    let jsonString = JSON.stringify(applicationType);
    expect(jsonString).toBeDefined();
  });
  it('should be able to serialize JS to XML', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "First Name";
    let applicationType = service.convertMspApplication(app);
    let xmlString = service.toXmlString(applicationType);
    //console.log(xmlString);
    expect(xmlString).toBeDefined();
  });

  it('should convert a fully populated object', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.dob_day = 31;
    app.applicant.dob_month = 12;
    app.applicant.dob_year = 1901;
    app.applicant.gender = Gender.Male;

    app.applicant.status = StatusInCanada.CitizenAdult;
    app.applicant.currentActivity = Activities.Returning;
    app.applicant.previous_phn = "912345678";
    app.applicant.movedFromProvinceOrCountry = "BC";
    app.applicant.arrivalToBCDay = 1;
    app.applicant.arrivalToBCMonth = 1;
    app.applicant.arrivalToBCYear = 1976;
    app.applicant.arrivalToCanadaDay = 2;
    app.applicant.arrivalToCanadaMonth = 2;
    app.applicant.arrivalToCanadaYear = 1977;

    let doc1 = new MspImage();
    doc1.contentType = "image/jpeg";
    doc1.fileContent = "data:image/jpeg;base64," + "blah";
    app.applicant.documents.images.push(doc1);

    app.authorizedByApplicant = true;
    app.authorizedByApplicantDate = new Date();
    app.authorizedBySpouse = false;
    app.residentialAddress.addressLine1 = "addr 1";
    app.residentialAddress.addressLine2 = "addr 2";
    app.residentialAddress.addressLine3 = "addr 3";
    app.residentialAddress.postal = "v3p 4l4";
    app.residentialAddress.city = "city";
    app.residentialAddress.country = "country";
    app.residentialAddress.province = "province";
    app.phoneNumber = "123-1234-457";

    app.addSpouse(new Person(Relationship.Spouse));
    app.spouse.dob_day = 31;
    app.spouse.dob_month = 12;
    app.spouse.dob_year = 1901;
    app.spouse.gender = Gender.Male;

    app.spouse.status = StatusInCanada.TemporaryResident;
    app.spouse.currentActivity = Activities.ReligousWorker;
    app.spouse.previous_phn = "912345678";
    app.spouse.movedFromProvinceOrCountry = "BC";
    app.spouse.arrivalToBCDay = 1;
    app.spouse.arrivalToBCMonth = 1;
    app.spouse.arrivalToBCYear = 1976;
    app.spouse.arrivalToCanadaDay = 2;
    app.spouse.arrivalToCanadaMonth = 2;
    app.spouse.arrivalToCanadaYear = 1977;

    let child = app.addChild(Relationship.Child19To24);
    child.firstName = "cfn";
    child.middleName = "cmn";
    child.lastName = "cln";
    child.gender = Gender.Female;
    child.schoolName = "school name";
    child.schoolAddress.addressLine1 = "addr1";
    child.schoolAddress.addressLine2 = "addr2";
    child.schoolAddress.addressLine3 = "addr3";
    child.status = StatusInCanada.PermanentResident;
    child.currentActivity = Activities.StudyingInBC;


    let doc2 = new MspImage();
    doc2.fileContent = "data:image/jpeg;base64," + "blah";
    app.spouse.documents.images.push(doc2);

    let applicationType = service.convertMspApplication(app);
    let jsonString = JSON.stringify(applicationType);
    //console.log(jsonString);
    let xmlString = service.toXmlString(applicationType, MspApiService.ApplicationTypeNameSpace);
    //console.log(xmlString);
    expect(jsonString).toBeDefined();
  });

  it('should conform to Maximus sample message', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "James";
    app.applicant.lastName = "Hamm";
    app.applicant.gender = Gender.Male;
    app.applicant.dob_day = 5;
    app.applicant.dob_month = 12;
    app.applicant.dob_year = 1966;
    app.residentialAddress.addressLine1 = "1234 Fort St.";
    app.residentialAddress.city = "Victoria";
    app.residentialAddress.postal = "V9R3T1";
    app.residentialAddress.province = "British Columbia";
    app.residentialAddress.country = "Canada";

    app.applicant.status = StatusInCanada.CitizenAdult;
    app.applicant.currentActivity = Activities.Returning;
    app.applicant.previous_phn = "1234567890";
    app.applicant.healthNumberFromOtherProvince = "123123123123";
    app.applicant.liveInBC = true;

    app.authorizedByApplicant = true;
    app.authorizedByApplicantDate = new Date();
    app.authorizedBySpouse = false;


    let doc1 = new MspImage();
    doc1.contentType = "image/jpeg";
    doc1.fileContent = "data:image/jpeg;base64," + "blah";
    app.applicant.documents.images.push(doc1);
    let doc12 = new MspImage();
    doc12.contentType = "image/jpeg";
    doc12.fileContent = "data:image/jpeg;base64," + "blah";
    app.applicant.documents.images.push(doc12);

    app.addSpouse(new Person(Relationship.Spouse));
    app.spouse.firstName = "Christine";
    app.spouse.lastName = "Mackie";
    app.spouse.dob_day = 5;
    app.spouse.dob_month = 12;
    app.spouse.dob_year = 1976;
    app.spouse.gender = Gender.Female;

    app.spouse.status = StatusInCanada.PermanentResident;
    app.spouse.currentActivity = Activities.Returning;
    app.spouse.previous_phn = "123456790";
    app.spouse.liveInBC = true;

    let doc2 = new MspImage();
    doc2.fileContent = "data:image/jpeg;base64," + "blah";
    app.spouse.documents.images.push(doc2);

    let child = app.addChild(Relationship.ChildUnder19);
    child.firstName = "Mary";
    child.lastName = "Hamm";
    child.gender = Gender.Female;
    child.dob_year = 1996;
    child.dob_month = 12;
    child.dob_day = 6;
    child.status = StatusInCanada.PermanentResident;
    child.currentActivity = Activities.Returning;
    child.liveInBC = true;
    child.previous_phn = "1234567890";

    let dependant = app.addChild(Relationship.Child19To24);
    dependant.firstName = "Someone else";
    dependant.lastName = "Hamm";
    dependant.gender = Gender.Female;
    dependant.dob_year = 1996;
    dependant.dob_month = 12;
    dependant.dob_day = 6;
    dependant.status = StatusInCanada.PermanentResident;
    dependant.currentActivity = Activities.Returning;
    dependant.liveInBC = true;
    dependant.previous_phn = "1234567890";
    dependant.schoolName = "Big school nam<e?>";
    dependant.studiesDepartureDay = 1;
    dependant.studiesDepartureMonth = 12;
    dependant.studiesDepartureYear = 2015;
    dependant.studiesFinishedDay = 1;
    dependant.studiesFinishedMonth = 1;
    dependant.studiesFinishedYear = 2020;
    dependant.schoolAddress.addressLine1 = "addr1";
    dependant.schoolAddress.city = "city";
    dependant.schoolAddress.country = "country";
    dependant.schoolAddress.postal = "12312123";
    dependant.schoolAddress.province = "Alberta";


    let applicationType = service.convertMspApplication(app);
    let jsonString = JSON.stringify(applicationType);
    let xmlString = service.toXmlString(applicationType, MspApiService.ApplicationTypeNameSpace);
    console.log(xmlString);
    expect(jsonString).toBeDefined();
  });


//   it('should sendMspApplication an object', done => {
//     let service = TestBed.get(MspApiService);
//     let app = new MspApplication();
//     app.applicant.firstName = "James";
//     app.applicant.lastName = "Hamm";
//     app.applicant.gender = Gender.Male;
//     app.applicant.dob_day = 5;
//     app.applicant.dob_month = 12;
//     app.applicant.dob_year = 1966;
//     app.phoneNumber = "5555555555";
//     app.residentialAddress.addressLine1 = "1234 Fort St.";
//     app.residentialAddress.city = "Victoria";
//     app.residentialAddress.postal = "V9R3T1";
//     app.residentialAddress.province = "British Columbia";
//     app.residentialAddress.country = "Canada";
//
//     app.applicant.status = StatusInCanada.PermanentResident;
//     app.applicant.currentActivity = Activities.Returning;
//     app.applicant.previous_phn = "1234567890";
//     app.applicant.liveInBC = true;
//
//     app.authorizedByApplicant = true;
//     app.authorizedByApplicantDate = new Date();
//     app.authorizedBySpouse = false;
//
//     let doc12 = new MspImage();
//     doc12.contentType = "image/jpeg";
//     doc12.fileContent = "data:image/jpeg;base64," + Data.image1;
//     doc12.size = 247764;
//     app.applicant.documents.images.push(doc12);
//
//     /*
//     app.addSpouse(new Person(Relationship.Spouse));
//     app.spouse.firstName = "Christine";
//     app.spouse.lastName = "Mackie";
//     app.spouse.dob_day = 5;
//     app.spouse.dob_month = 12;
//     app.spouse.dob_year = 1976;
//     app.spouse.gender = Gender.Female;
//
//     app.spouse.status = StatusInCanada.PermanentResident;
//     app.spouse.currentActivity = Activities.Returning;
//     app.spouse.previous_phn = "123456790";
//     app.spouse.liveInBC = true;
//
//     //let doc2 = new MspImage();
//     //doc2.contentType = "image/jpeg";
//     //app.spouse.documents.images.push(doc2);
//
//     let child = app.addChild(Relationship.Child19To24);
//     child.firstName = "Mary";
//     child.lastName = "Hamm";
//     child.gender = Gender.Female;
//     child.dob_year = 1996;
//     child.dob_month = 12;
//     child.dob_day = 6;
//     child.status = StatusInCanada.PermanentResident;
//     child.currentActivity = Activities.Returning;
//     child.liveInBC = true;
//     child.previous_phn = "1234567890";
// */
//
//     let promise = service.sendApplication(app);
//     promise.then((application: ApplicationBase) => {
//
//       expect(application.referenceNumber).toBeDefined();
//       expect(application.referenceNumber.length).toBeGreaterThan(0);
//
//       // signal jasmine were done
//       done();
//     }).catch((error: Error) => {
//       console.log("spec error: ", error);
//       done.fail("failed by rejection");
//     });
//
//   });
  it('should convert an assistance application', () => {
    let service = TestBed.get(MspApiService);
    let app = new FinancialAssistApplication();

    app.childWithDisabilityCount = 2;
    app.authorizedBySpouse = true;
    app.authorizedByApplicant = true;
    app.childrenCount = 8;
    app.childWithDisabilityCount = 4;
    app.applicant.firstName = "Greg";
    app.applicant.middleName = "W";
    app.applicant.lastName = "Boss";
    app.applicant.dob_day = 1;
    app.applicant.dob_month = 1;
    app.applicant.dob_year = 1999;
    app.applicant.previous_phn = "9012372173";
    app.applicant.sin = "654 974 5646";
    app.mailingAddress.addressLine1 = "add1";
    app.mailingAddress.addressLine2 = "add2";
    app.mailingAddress.addressLine3 = "add3";
    app.mailingAddress.city = "lkajsdkjasd";
    app.mailingAddress.province = "Alberta";
    app.mailingAddress.country = "Canada";
    app.mailingAddress.postal = "v8o 2l3";
    app.phoneNumber = "250-232-1233";
    app.spouse.firstName = "Greg";
    app.spouse.middleName = "W";
    app.spouse.lastName = "Boss";
    app.spouse.dob_day = 1;
    app.spouse.dob_month = 1;
    app.spouse.dob_year = 1999;
    app.spouse.previous_phn = "9012372173";
    app.spouse.sin = "654 974 5646";
    app.claimedChildCareExpense_line214 = 12345;
    app.reportedUCCBenefit_line117 = 123123;
    app.ageOver65 = true;
    app.spouseAgeOver65 = true;
    app.spouseDSPAmount_line125 = 123123;
    app.spouseIncomeLine236 = 12323123;
    app.spouseEligibleForDisabilityCredit = true;
    app.netIncomelastYear = 123123123;
    let assistYear = new AssistanceYear();
    assistYear.apply = true;
    assistYear.year = 2015;
    app.assistYears.push(assistYear);

    let document = service.convertAssistance(app);

    expect(document).toBeDefined();

    console.log("pa document: ", service.toXmlString(document));

  });

  // it('should send an assistance application', (done) => {
  //
  //   let service = TestBed.get(MspApiService);
  //   let app = new FinancialAssistApplication();
  //
  //   app.childWithDisabilityCount = 2;
  //   app.authorizedBySpouse = true;
  //   app.authorizedByApplicant = true;
  //   app.childrenCount = 8;
  //   app.childWithDisabilityCount = 4;
  //   app.applicant.firstName = "Greg";
  //   app.applicant.middleName = "W";
  //   app.applicant.lastName = "Boss";
  //   app.applicant.dob_day = 1;
  //   app.applicant.dob_month = 1;
  //   app.applicant.dob_year = 1999;
  //   app.applicant.gender = Gender.Female;
  //   app.applicant.previous_phn = "9012372173";
  //   app.applicant.sin = "654 974 564";
  //   app.eligibility.spouseSixtyFiveDeduction = 2154;
  //   app.eligibility.adjustedNetIncome = 56487;
  //   app.eligibility.totalNetIncome = 56454;
  //   app.eligibility.childDeduction = 65454;
  //   app.eligibility.deductionDifference = 6565;
  //   app.eligibility.deductions = 879878;
  //   app.eligibility.totalDeductions = 654545;
  //   app.eligibility.premiumAssistanceYear = 2015;
  //   app.eligibility.taxYear = 2016;
  //   //app.eligibility.spouseDeduction = 65454;
  //   app.eligibility.sixtyFiveDeduction = 54;
  //   app.residentialAddress.addressLine1 = "add1";
  //   app.residentialAddress.addressLine2 = "add2";
  //   app.residentialAddress.addressLine3 = "add3";
  //   app.residentialAddress.city = "lkajsdkjasd";
  //   app.residentialAddress.province = "Alberta";
  //   app.residentialAddress.country = "Canada";
  //   app.residentialAddress.postal = "v8o 2l3";
  //   app.mailingAddress = app.residentialAddress;
  //   app.mailingSameAsResidentialAddress = false;
  //   app.phoneNumber = "250-232-1233";
  //   app.spouse.firstName = "Greg";
  //   app.spouse.middleName = "W";
  //   app.spouse.lastName = "Boss";
  //   app.spouse.dob_day = 1;
  //   app.spouse.dob_month = 1;
  //   app.spouse.dob_year = 1999;
  //   app.spouse.gender = Gender.Male;
  //   app.spouse.previous_phn = "9012372173";
  //   app.spouse.sin = "654 974 564";
  //   app.claimedChildCareExpense_line214 = 12345;
  //   app.reportedUCCBenefit_line117 = 123123;
  //   app.ageOver65 = true;
  //   app.spouseAgeOver65 = true;
  //   app.spouseDSPAmount_line125 = 123123;
  //   app.spouseIncomeLine236 = 12323123;
  //   app.spouseEligibleForDisabilityCredit = true;
  //   app.netIncomelastYear = 123123123;
  //
  //   let promise = service.sendApplication(app);
  //   promise.then((application: ApplicationBase) => {
  //
  //     expect(application.referenceNumber).toBeDefined();
  //     expect(application.referenceNumber.length).toBeGreaterThan(0);
  //
  //     // signal jasmine were done
  //     done();
  //   }).catch((error: Error) => {
  //     console.log("spec error: ", error);
  //     done.fail("failed by rejection");
  //   });
  //
  //
  // });


});

