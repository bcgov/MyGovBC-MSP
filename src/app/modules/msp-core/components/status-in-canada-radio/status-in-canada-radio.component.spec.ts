import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MspStatusInCanadaRadioComponent } from './status-in-canada-radio.component';
import { StatusInCanada, CanadianStatusReason } from '../../models/canadian-status.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../models/relationship.enum';

describe('StatusInCanadaRadioComponent', () => {
    let comp: MspStatusInCanadaRadioComponent;
    let fixture: ComponentFixture<MspStatusInCanadaRadioComponent>;

    beforeEach(() => {
        const statusInCanadaStub = {};
        const personStub = {
            status: {},
            currentActivity: {},
            institutionWorkHistory: {}
        };
        TestBed.configureTestingModule({
            declarations: [ MspStatusInCanadaRadioComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [ FormsModule ],
            providers: [
                { provide: StatusInCanada, useValue: statusInCanadaStub },
                { provide: MspPerson, useValue: personStub }
            ]
        });
        fixture = TestBed.createComponent(MspStatusInCanadaRadioComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('Activities defaults to: Activities', () => {
        expect(comp.Activities).toEqual(CanadianStatusReason);
    });

    it('StatusInCanada defaults to: StatusInCanada', () => {
        expect(comp.StatusInCanada).toEqual(StatusInCanada);
    });

    it('should be invalid with a default person status', () => {
        const applicant = new MspPerson(Relationship.Applicant);
        comp.person = applicant;
        expect(comp.isValid()).toBeFalsy();
    });

    it('should be valid when person has a set status', () => {
        const applicant = new MspPerson(Relationship.Applicant);
        applicant.status = StatusInCanada.CitizenAdult;
        comp.person = applicant;
        expect(comp.isValid()).toBeTruthy();
    });

    it('should be invalid when a temporary status is set without an activity', () => {
        const applicant = new MspPerson(Relationship.Applicant);
        comp.person = applicant;
        comp.setStatus(StatusInCanada.TemporaryResident, applicant);
        expect(comp.isValid()).toBeFalsy();
    });

    it('should be valid when a temporary status is set with an activity', () => {
        const applicant = new MspPerson(Relationship.Applicant);
        comp.person = applicant;
        comp.setStatus(StatusInCanada.TemporaryResident, applicant);
        comp.setActivity(CanadianStatusReason.StudyingInBC);
        expect(comp.isValid()).toBeTruthy();
    });

    it('should be able to go from invalid to valid', () => {
        const applicant = new MspPerson(Relationship.Applicant);
        comp.person = applicant;
        expect(comp.isValid()).toBeFalsy();
        comp.setStatus(StatusInCanada.CitizenAdult, applicant);
        expect(comp.isValid()).toBeTruthy();
    });

    it('should be able to set a person\'s activity if their status is a temporary permit holder or diplomat', () => {
        const applicant = new MspPerson(Relationship.Applicant);
        comp.person = applicant;
        comp.setStatus(StatusInCanada.TemporaryResident, applicant);
        comp.setActivity(CanadianStatusReason.WorkingInBC);
        expect(comp.person.currentActivity).toBe(CanadianStatusReason.WorkingInBC);
    });

});
