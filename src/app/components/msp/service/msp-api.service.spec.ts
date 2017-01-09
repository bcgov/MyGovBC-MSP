import { TestBed } from '@angular/core/testing';
import {MspApiService} from "./msp-api.service";
import {MspApplication} from "../model/application.model";
import {Gender} from "../model/person.model";
import {MspImage} from "../model/msp-image";

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
    let applicationType = service.convert(app);
    let jsonString = JSON.stringify(applicationType);
    console.log(jsonString);
    expect(jsonString).toBeDefined();
  });


})
