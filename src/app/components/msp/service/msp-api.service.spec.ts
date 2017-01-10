import { TestBed } from '@angular/core/testing';
import {MspApiService} from "./msp-api.service";
import {MspApplication} from "../model/application.model";
import {Gender} from "../model/person.model";
import {MspImage} from "../model/msp-image";
import {StatusInCanada, Activities} from "../model/status-activities-documents";

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

  it ('should convert some custom types', () => {
    let service = TestBed.get(MspApiService);
    let app = new MspApplication();
    app.applicant.dob_day = 31;
    app.applicant.dob_month = 12;
    app.applicant.dob_year = 1901;
    app.applicant.gender = Gender.Male;
    app.applicant.documents.images.push(new MspImage());
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

    let applicationType = service.convert(app);
    let jsonString = JSON.stringify(applicationType);
    console.log(jsonString);
    let xmlString = service.toXmlString(applicationType);
    console.log(xmlString);
    expect(jsonString).toBeDefined();
  });


})
