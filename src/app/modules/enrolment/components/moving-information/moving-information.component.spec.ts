import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MovingInformationComponent } from './moving-information.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Class used to setup data for testing
 */
class Applicant {

  person: MspPerson;

  constructor( relationship: Relationship,
               status: StatusInCanada,
               statusReason: CanadianStatusReason ) {
    this.person = new MspPerson( relationship );
    this.person.status = status;
    this.person.currentActivity = statusReason;
  }

  permanentMoveBC( permanent: boolean = true ): MspPerson {
    this.person.madePermanentMoveToBC = permanent;
    return this.person;
  }

  livedBCSinceBirth( livedIn: boolean = true ): MspPerson {
    this.person.livedInBCSinceBirth = livedIn;
    return this.person;
  }
}


fdescribe('MovingInformationComponent', () => {
  let component: MovingInformationComponent;
  let fixture: ComponentFixture<MovingInformationComponent>;
  let person: Applicant;
  let err: DebugElement;
  let elmts: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MovingInformationComponent
        ],
      imports: [
        FormsModule,
        SharedCoreModule
      ],
      providers: [
        NgForm
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    person = null;
    fixture = TestBed.createComponent(MovingInformationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.person = new MspPerson(Relationship.Unknown);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('(Applicant) Canadian Citizen -> province move not permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.MovingFromProvince );
    component.person = person.permanentMoveBC(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(1);
  });

  it('(Applicant) Canadian Citizen -> country move not permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.MovingFromCountry );
    component.person = person.permanentMoveBC(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(1);
  });

  it('(Applicant) Canadian Citizen -> without MSP not lived in BC since birth', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.LivingInBCWithoutMSP );
    component.person = person.livedBCSinceBirth(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(8);
  });

  it('(Applicant) Canadian Citizen -> without MSP not lived in BC since birth not permanent' , () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.LivingInBCWithoutMSP );
    component.person = person.livedBCSinceBirth(false);
    component.person.madePermanentMoveToBC = false;
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(2);
  });

  it('(Applicant) Canadian Citizen -> without MSP lived in BC since birth', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.LivingInBCWithoutMSP );
    component.person = person.livedBCSinceBirth();
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(5);
  });

  it('(Applicant) Canadian Citizen -> without MSP lived in BC since birth not permanent', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.LivingInBCWithoutMSP );
    component.person = person.livedBCSinceBirth();
    component.person.madePermanentMoveToBC = false;
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(2);
  });

  it('(Applicant) Canadian Citizen -> province move permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.CitizenAdult,
                            CanadianStatusReason.MovingFromProvince );
    component.person = person.permanentMoveBC();
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(8);
  });

  // permanent Resident
  it('(Applicant) Permanent Resident -> province move not permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.PermanentResident,
                            CanadianStatusReason.MovingFromProvince );
    component.person = person.permanentMoveBC(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(1);
  });

  it('(Applicant) Permanent Resident -> country move not permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.PermanentResident,
                            CanadianStatusReason.MovingFromCountry );
    component.person = person.permanentMoveBC(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(1);
  });


  it('(Applicant) Permanent Resident -> without MSP move not permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.PermanentResident,
                            CanadianStatusReason.LivingInBCWithoutMSP );
    component.person = person.permanentMoveBC(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeTruthy();
    expect(elmts.length).toBe(1);
  });

  it('(Applicant) Permanent Resident -> without MSP move permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.PermanentResident,
                            CanadianStatusReason.LivingInBCWithoutMSP );
    component.person = person.permanentMoveBC();
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(6);
  });

  it('(Applicant) Permanent Resident -> province move permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.PermanentResident,
                            CanadianStatusReason.MovingFromProvince );
    component.person = person.permanentMoveBC();
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(8);
  });

  // Temporary Resident
  it('(Applicant) Temporary Resident -> province move not permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.TemporaryResident,
                            CanadianStatusReason.Visiting );
    component.person = person.permanentMoveBC(false);
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(6);
  });

  it('(Applicant) Temporary Resident -> province move permanent in BC', () => {
    person = new Applicant( Relationship.Applicant,
                            StatusInCanada.TemporaryResident,
                            CanadianStatusReason.Visiting );
    component.person = person.permanentMoveBC();
    fixture.detectChanges();

    err = fixture.debugElement.query(By.css('.error--container'));
    elmts = fixture.debugElement.queryAll(By.css('.form-group'));
    expect(err).toBeNull();
    expect(elmts.length).toBe(6);
  });

});
