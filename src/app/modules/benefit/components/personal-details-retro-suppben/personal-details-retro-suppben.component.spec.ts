import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { CommonImage } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { Relationship } from '../../../../models/relationship.enum';
import { PersonalDetailsRetroSuppbenComponent } from './personal-details-retro-suppben.component';

describe('PersonalDetailsRetroSuppbenComponent', () => {
  let component: PersonalDetailsRetroSuppbenComponent;
  let fixture: ComponentFixture<PersonalDetailsRetroSuppbenComponent>;

  beforeEach(async(() => {
    const changeDetectorRefStub = () => ({});
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { applicant: {}, setSpouse: {}, spouse: {} },
      saveBenefitApplication: () => ({})
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PersonalDetailsRetroSuppbenComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ],
      imports: [
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsRetroSuppbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it(`should have default removeable value`, () => {
    expect(component.removeable).toEqual(false);
  });
 
  it(`should have default Relationship value`, () => {
    expect(component.Relationship).toEqual(Relationship);
  });
});
