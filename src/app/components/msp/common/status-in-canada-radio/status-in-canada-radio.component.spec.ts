import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StatusInCanada } from "../../model/status-activities-documents";
import { Person } from "../../model/person.model";
import { Activities, Relationship } from "../../model/status-activities-documents";
import { StatusInCanadaRadioComponent } from "./status-in-canada-radio.component";

describe("StatusInCanadaRadioComponent", () => {
    let comp: StatusInCanadaRadioComponent;
    let fixture: ComponentFixture<StatusInCanadaRadioComponent>;

    beforeEach(() => {
        const statusInCanadaStub = {};
        const personStub = {
            status: {},
            currentActivity: {},
            institutionWorkHistory: {}
        };
        TestBed.configureTestingModule({
            declarations: [ StatusInCanadaRadioComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: StatusInCanada, useValue: statusInCanadaStub },
                { provide: Person, useValue: personStub }
            ]
        });
        fixture = TestBed.createComponent(StatusInCanadaRadioComponent);
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

    it("should be able to go from invalid to valid", () => {
        let applicant = new Person(Relationship.Applicant);
        comp.person = applicant;
        expect(comp.isValid()).toBeFalsy();
        applicant.status = StatusInCanada.CitizenAdult;
        expect(comp.isValid()).toBeTruthy();        
    });

});
