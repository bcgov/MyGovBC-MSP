import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StatusInCanada } from "../../model/status-activities-documents";
import { Person } from "../../model/person.model";
import { Activities } from "../../model/status-activities-documents";
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

});
