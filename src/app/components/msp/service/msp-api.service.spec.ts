import {TestBed, fakeAsync, inject} from '@angular/core/testing';
import {MspApiService} from "./msp-api.service";
import {MspApplication} from "../model/application.model";
import {Gender, Person} from "../model/person.model";
import {MspImage} from "../model/msp-image";
import {StatusInCanada, Activities, Relationship} from "../model/status-activities-documents";
import {HttpModule} from "@angular/http";
import appConstants from '../../../services/appConstants';

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
    expect(service.convert(new MspApplication())).toBeDefined();
  });
  it('should display some JSON', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "First Name";
    let applicationType = service.convert(app);
    let jsonString = JSON.stringify(applicationType);
    expect(jsonString).toBeDefined();
  });
  it('should be able to serialize JS to XML', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "First Name";
    let applicationType = service.convert(app);
    let xmlString = service.toXmlString(applicationType);
    console.log(xmlString);
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
    app.applicant.movedFromProvince = "BC";
    app.applicant.arrivalToBCDay = 1;
    app.applicant.arrivalToBCMonth = 1;
    app.applicant.arrivalToBCYear = 1976;
    app.applicant.arrivalToCanadaDay = 2;
    app.applicant.arrivalToCanadaMonth = 2;
    app.applicant.arrivalToCanadaYear = 1977;

    let doc1 = new MspImage();
    doc1.contentType = "image/jpeg";
    app.applicant.documents.images.push(doc1);

    app.authorizedByApplicant = true;
    app.authorizedByApplicantDate = new Date();
    app.authorizedBySpouse = false;
    app.authorizedBySpouseDate = new Date();
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
    app.spouse.movedFromProvince = "BC";
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
    doc2.contentType = "application/pdf";
    app.spouse.documents.images.push(doc2);

    let applicationType = service.convert(app);
    let jsonString = JSON.stringify(applicationType);
    console.log(jsonString);
    let xmlString = service.toXmlString(applicationType, MspApiService.ApplicationTypeNameSpace);
    console.log(xmlString);
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
    app.residentialAddress.province = "BC";
    app.residentialAddress.country = "Canada";

    app.applicant.status = StatusInCanada.PermanentResident;
    app.applicant.currentActivity = Activities.Returning;
    app.applicant.previous_phn = "1234567890";
    app.applicant.liveInBC = true;

    app.authorizedByApplicant = true;
    app.authorizedByApplicantDate = new Date();
    app.authorizedBySpouse = false;
    app.authorizedBySpouseDate = new Date();


    let doc1 = new MspImage();
    doc1.contentType = "image/jpeg";
    app.applicant.documents.images.push(doc1);
    let doc12 = new MspImage();
    doc12.contentType = "image/jpeg";
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
    doc2.contentType = "image/jpeg";
    app.spouse.documents.images.push(doc2);

    let child = app.addChild(Relationship.Child19To24);
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

    let applicationType = service.convert(app);
    let jsonString = JSON.stringify(applicationType);
    let xmlString = service.toXmlString(applicationType, MspApiService.ApplicationTypeNameSpace);
    console.log(xmlString);
    expect(jsonString).toBeDefined();
  });

  it('should send an object', done => {
    done();
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.dob_day = 31;
    app.applicant.dob_month = 12;
    app.applicant.dob_year = 1901;
    app.applicant.gender = Gender.Male;

    app.applicant.status = StatusInCanada.CitizenAdult;
    app.applicant.currentActivity = Activities.Returning;
    app.applicant.previous_phn = "912345678";
    app.applicant.movedFromProvince = "BC";
    app.applicant.arrivalToBCDay = 1;
    app.applicant.arrivalToBCMonth = 1;
    app.applicant.arrivalToBCYear = 1976;
    app.applicant.arrivalToCanadaDay = 2;
    app.applicant.arrivalToCanadaMonth = 2;
    app.applicant.arrivalToCanadaYear = 1977;

    //let doc1 = new MspImage();
    //doc1.contentType = "image/jpeg";
    //app.applicant.documents.images.push(doc1);

    app.authorizedByApplicant = true;
    app.authorizedByApplicantDate = new Date();
    app.authorizedBySpouse = false;
    app.authorizedBySpouseDate = new Date();
    app.residentialAddress.addressLine1 = "addr 1";
    app.residentialAddress.addressLine2 = "addr 2";
    app.residentialAddress.addressLine3 = "addr 3";
    app.residentialAddress.postal = "v3p 4l4";
    app.residentialAddress.city = "city";
    app.residentialAddress.country = "country";
    app.residentialAddress.province = "province";
    app.phoneNumber = "123-1234-457";

    let promise = service.send(app);
    promise.then((application: MspApplication) => {

      expect(application.referenceNumber).toBeDefined();
      expect(application.referenceNumber.length).toBeGreaterThan(0);

      // signal jasmine were done
      done();
    }).catch((error: Error) => {
      done.fail(JSON.stringify(error));
    });

  });
});

