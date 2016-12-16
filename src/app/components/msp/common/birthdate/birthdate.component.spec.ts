import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspBirthDateComponent } from './birthdate.component'
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {Person} from "../../model/person.model";
import {Relationship} from "../../model/status-activities-documents";

describe('MspBirthDateComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspBirthDateComponent],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspBirthDateComponent);

    fixture.componentInstance.person = new Person(Relationship.Applicant);
    expect(fixture.componentInstance instanceof MspBirthDateComponent).toBe(true, 'should create MspBirthDateComponent');

  });
})
