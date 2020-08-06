import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { PageStateService } from '../../../../services/page-state.service';
import { EnrolDataService } from '../../services/enrol-data.service';
import { FormsModule } from '@angular/forms';
import { PersonalInfoComponent } from './personal-info.component';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const pageStateServiceStub = () => ({setPageIncomplete: () => {}});
    const enrolDataServiceStub = () => ({application: { applicant: { documents: [] } }});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PersonalInfoComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: PageStateService, useFactory: pageStateServiceStub },
        { provide: EnrolDataService, useFactory: enrolDataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
