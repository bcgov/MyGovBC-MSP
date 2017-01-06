import { TestBed } from '@angular/core/testing';
import {MspApiService} from "./msp-api.service";
import {MspApplication} from "../model/application.model";

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
    let applicationType = service.convert(new MspApplication());
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
})
