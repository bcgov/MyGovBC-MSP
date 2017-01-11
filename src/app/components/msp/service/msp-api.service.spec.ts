import { TestBed } from '@angular/core/testing';
import {MspApiService} from "./msp-api.service";
import {MspApplication} from "../model/application.model";
import {Gender, Person} from "../model/person.model";
import {MspImage} from "../model/msp-image";
import {StatusInCanada, Activities, Relationship} from "../model/status-activities-documents";

describe('MspApiService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MspApiService]
    })
  });
  it ('should be defined', () => {
    let service = TestBed.get(MspApiService);
    expect(service).toBeDefined();
  });
  it ('should convert something simple', () => {
    let service = TestBed.get(MspApiService);
    expect(service.convert(new MspApplication())).toBeDefined();
  });
  it ('should display some JSON', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "First Name";
    let applicationType = service.convert(app);
    let jsonString = JSON.stringify(applicationType);
    expect(jsonString).toBeDefined();
  });
  it ('should be able to serialize JS to XML', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.firstName = "First Name";
    let applicationType = service.convert(app);
    let xmlString = service.toXmlString(applicationType);
    console.log(xmlString);
    expect(xmlString).toBeDefined();
  });

  it ('should convert a fully populated object', () => {
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


})
