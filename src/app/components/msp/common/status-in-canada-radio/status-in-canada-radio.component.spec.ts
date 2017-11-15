import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { StatusInCanada } from "../../model/status-activities-documents";
import { Person } from "../../model/person.model";
import { Activities, Relationship } from "../../model/status-activities-documents";
import { MspStatusInCanadaRadioComponent } from "./status-in-canada-radio.component";

describe("StatusInCanadaRadioComponent", () => {
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
                { provide: Person, useValue: personStub }
            ]
        });
        fixture = TestBed.createComponent(MspStatusInCanadaRadioComponent);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("Activities defaults to: Activities", () => {
        expect(comp.Activities).toEqual(Activities);
    });

    it("StatusInCanada defaults to: StatusInCanada", () => {
        expect(comp.StatusInCanada).toEqual(StatusInCanada);
    });

    it("should be invalid with a default person status", () => {
        let applicant = new Person(Relationship.Applicant);
        comp.person = applicant;
        expect(comp.isValid()).toBeFalsy();
    });

    it("should be valid when person has a set status", () => {
        let applicant = new Person(Relationship.Applicant);
        applicant.status = StatusInCanada.CitizenAdult;        
        comp.person = applicant;
        expect(comp.isValid()).toBeTruthy();
    });

    it("should be invalid when a temporary status is set without an activity", () => {
        let applicant = new Person(Relationship.Applicant);
        comp.person = applicant;
        comp.setStatus(StatusInCanada.TemporaryResident, applicant);
        expect(comp.isValid()).toBeFalsy();
    });

    it("should be valid when a temporary status is set with an activity", () => {
        let applicant = new Person(Relationship.Applicant);
        comp.person = applicant;
        comp.setStatus(StatusInCanada.TemporaryResident, applicant);
        comp.setActivity(Activities.StudyingInBC);
        expect(comp.isValid()).toBeTruthy();
    });

    it("should be able to go from invalid to valid", () => {
        let applicant = new Person(Relationship.Applicant);
        comp.person = applicant;
        expect(comp.isValid()).toBeFalsy();
        comp.setStatus(StatusInCanada.CitizenAdult, applicant);
        expect(comp.isValid()).toBeTruthy();        
    });

    it("should be able to set a person's activity if their status is a temporary permit holder or diplomat", () => {    
        let applicant = new Person(Relationship.Applicant);
        comp.person = applicant;
        comp.setStatus(StatusInCanada.TemporaryResident, applicant);
        comp.setActivity(Activities.WorkingInBC);
        expect(comp.person.currentActivity).toBe(Activities.WorkingInBC);
    });

});
