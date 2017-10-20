import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MspDataService } from "../../service/msp-data.service";
import { Router } from "@angular/router";
import { ProcessService } from "../../service/process.service";
import { LocalStorageModule } from "angular-2-local-storage";
import { Relationship } from "../../model/status-activities-documents";
import { AccountDependentChangeComponent } from "./dependent-change.component";




import { CaptchaComponent } from "mygovbc-captcha-widget/src/app/captcha/captcha.component";
import { CaptchaDataService } from "mygovbc-captcha-widget/src/app/captcha-data.service";

describe("AccountDependentChangeComponent", () => {
    let comp: AccountDependentChangeComponent;
    let fixture: ComponentFixture<AccountDependentChangeComponent>;

    beforeEach(() => {
        const changeDetectorRefStub = {};
        const routerStub = {};
        const processServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [ AccountDependentChangeComponent, CaptchaComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
                MspDataService,
                { provide: Router, useValue: routerStub },
                { provide: ProcessService, useValue: processServiceStub },
                CaptchaDataService
            ],
            imports: [FormsModule, LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
              })]
        });
        fixture = TestBed.createComponent(AccountDependentChangeComponent);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("addedPersons defaults to: []", () => {
        expect(comp.addedPersons).toEqual([]);
    });

    describe("onChange", () => {
        it("makes expected calls", () => {
            const mspDataServiceStub = fixture.debugElement.injector.get(MspDataService);
            spyOn(mspDataServiceStub, "saveMspAccountApp");
            comp.onChange();
            expect(mspDataServiceStub.saveMspAccountApp).toHaveBeenCalled();
        });
    });

    it("can add a spouse", () => {
        comp.addSpouse();
        expect(comp.spouse).toBeDefined();
    });

    it("can clear an added spouse", () => {
        comp.addSpouse();
        expect(comp.spouse).toBeDefined();
        let sp = comp.spouse;
        comp.clearDependent(sp);
        expect(comp.spouse).toBeNull();
    });

    it("can add a child and clear them", () => {
        comp.addChild(Relationship.ChildUnder19);
        expect(comp.children.length).toBe(1);
        comp.addChild(Relationship.Child19To24);
        expect(comp.children.length).toBe(2);
        comp.clearDependent(comp.children[0]);
        comp.clearDependent(comp.children[0]); //second child, as indexes are reset
        expect(comp.children.length).toBe(0);        
    });

});
