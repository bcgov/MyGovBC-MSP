import { ProcessService, Process } from './process.service';
import { MspDataService } from '../../../services/msp-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { async, TestBed, getTestBed } from '@angular/core/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountComponent } from '../account/account.component';
import {MspLogService} from '../../../services/log.service';
import { HttpClientModule} from '@angular/common/http';


describe('ProcessService', () => {
    let processService: ProcessService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ProcessService,
                MspDataService,
                LocalStorageService,
                MspLogService
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                LocalStorageModule.withConfig({
                    prefix: 'ca.bc.gov.msp',
                    storageType: 'sessionStorage'
                })
            ],
            declarations: [
                AccountComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });


        getTestBed().get(LocalStorageService).clearAll();
        processService = getTestBed().get(ProcessService);
    }));

    it('should run this test', () => {
        expect(1).toBe(1, 'error is likely in beforeEach');
    });

    it('should be created', () => {
        expect(processService instanceof ProcessService).toBe(true, 'self-identity check is failing, testbed configuration not working.');
    });

    it('should have a canActivate function', () => {
        expect(typeof processService.canActivate).toBe('function', 'canActivate is not a function, which means route guarding will not work.');
    });

    it('should not have a process before init', () => {
        expect(processService.process).toBeDefined('process is not defined');
        //This might mean that data is persisting between tests. Ensure local storage is being purged.
        expect(processService.process).toBeNull('process exists before init');
    });

    it('should be configured by AccountComponent on init', () => {
        const fixture = TestBed.createComponent(AccountComponent);
        const comp = fixture.componentInstance;
        expect(processService.process).toBeTruthy('process should be configured by AccountComponent.initProcessSerivce()');
        //[prepare, documents, review, and sending] should always exist.
        expect(processService.process.processSteps.length).toBeGreaterThanOrEqual(4, 'insufficient processSteps by default');
    });

    /**
     * TODO ----
     *      - Write more tests for AccountComponent
     *      - Use RouterTesting module, test route guarding.
     *      - Test navigating through the steps.
     */
});
