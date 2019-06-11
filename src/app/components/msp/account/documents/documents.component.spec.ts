import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountDocumentsComponent } from './documents.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessService } from '../../service/process.service';
import { async } from '@angular/core/testing';
import { AccountDocumentHelperService } from '../../service/account-document-helper.service';
import {DocumentGroup} from '../../model/account-documents';
import {
    StatusRules, ActivitiesRules, StatusInCanada, Activities,
    DocumentRules, Documents, Relationship , CancellationReasonsForSpouse
} from '../../model/status-activities-documents';

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
            providers: [MspDataService, ProcessService, AccountDocumentHelperService]
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
        const accountDocument = TestBed.get(AccountDocumentHelperService);
        accountDocument.addIfSpouseIsAdded();
        accountDocument.addIfPIIsSelected();
        accountDocument.addIfStatusIsUpdated();
       // comp.documentsList = accountDocument.getApplicableDocuments();
        fixture.detectChanges();
        expect(comp.documentsList.length).toBeCloseTo(0);
    });

    it('should have document type indices on init', () => {
        const accountDocument = TestBed.get(AccountDocumentHelperService);
        comp.documentsList = accountDocument.getApplicableDocuments();
        fixture.detectChanges();
        expect(comp.documentIndices().length).toBeCloseTo(0);
    });

    it('does require docs by default', () => {
        expect(comp.isDocsNotNeeded).toBeFalsy();
    });

    it('doesn\'t require docs when name change due to marriage', () => {
        const dataService = TestBed.get(MspDataService);
        dataService.getMspAccountApp().accountChangeOptions.dependentChange = true;
        expect(comp.isDocsNotNeeded).toBeTruthy();
    });

    it('doesn\'t require docs when its changing an existing beneficiary child', () => {
        const dataService = TestBed.get(MspDataService);
        dataService.getMspAccountApp().accountChangeOptions.dependentChange = true;
        expect(comp.isDocsNotNeeded).toBeTruthy();
    });


});
