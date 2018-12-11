import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountDocumentsComponent } from './documents.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessService } from '../../service/process.service';
import { async } from '@angular/core/testing';

describe('AccountDocumentsComponent', () => {
    let fixture: ComponentFixture<AccountDocumentsComponent>;
    let comp: AccountDocumentsComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [AccountDocumentsComponent],
            imports: [FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
            })],
            providers: [MspDataService, ProcessService]
        });

    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(AccountDocumentsComponent);
        comp = fixture.componentInstance;
    });

    it('should work', () => {
        expect(comp instanceof AccountDocumentsComponent).toBe(true, 'should create AccountDocumentsComponent');
    });

    it('should have document types on init', () => {
        expect(comp.documents.length).toBeGreaterThan(2);
    });

    it('should have document type indices on init', () => {
        expect(comp.documentIndices().length).toBeGreaterThan(2);
    });

    it('does require docs by default', () => {
        expect(comp.isDocsNotNeeded).toBeFalsy();
    });

    it('doesn\'t require docs when name change due to marriage', () => {
        const dataService = TestBed.get(MspDataService);
        dataService.getMspAccountApp().accountChangeOptions.nameChangeDueToMarriage = true;
        expect(comp.isDocsNotNeeded).toBeTruthy();
    });

    it('doesn\'t require docs when its changing an existing beneficiary child', () => {
        const dataService = TestBed.get(MspDataService);
        dataService.getMspAccountApp().accountChangeOptions.dependentChange = true;
        expect(comp.isDocsNotNeeded).toBeTruthy();
    });


});
