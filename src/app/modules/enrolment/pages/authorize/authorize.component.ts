import {Component, ViewChild, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {MspApplication} from '../../models/application.model';
import { MspDataService } from '../../../../services/msp-data.service';
import { environment } from '../../../../../environments/environment';
import { MspLogService } from '../../../../services/log.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { PageStateService } from '../../../../services/page-state.service';
import { AbstractForm } from 'moh-common-lib';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'msp-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent extends AbstractForm implements OnInit {

  application: MspApplication;
  captchaApiBaseUrl: string;
  subscriptions: Subscription[];

  constructor(private dataService: MspDataService,
              protected router: Router,
              private pageStateService: PageStateService,
              private logService: MspLogService) {
     super(router);
    this.application = this.dataService.mspApplication;
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }


  ngOnInit(){
   /* let oldUUID = this.application.uuid;
    this.application.regenUUID();
    this.dataService.saveMspApplication();
    console.log('EA uuid updated: from %s to %s', oldUUID, this.dataService.getMspApplication().uuid);*/
    this.pageStateService.setPageIncomplete(this.router.url, this.dataService.mspApplication.pageStatus);
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspApplication();
        })
      ];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  applicantAuthorizeOnChange(event: boolean) {
    // console.log('applicant authorization: ', event);
    this.application.authorizedByApplicant = event;

    if (this.application.authorizedByApplicant) {
      this.application.authorizedByApplicantDate = new Date();
    }
  }

  get questionApplicant(){
    return this.applicantName + ', do you agree?';
  }
  get questionSpouse(){
    return this.spouseName + ', do you agree?';
  }
  get applicantName(){
    return this.application.applicant.firstName + ' ' + this.application.applicant.lastName;
  }
  get spouseName(){
    return this.application.spouse.firstName + ' ' + this.application.spouse.lastName;
  }

  canContinue(): boolean {
    return super.canContinue() && this.application.hasValidAuthToken;
  }

  continue() {
    // console.log('review form submitted, %o', evt);
    if (this.application.hasValidAuthToken){
      console.log('Found valid auth token, transfer to sending screen.');
      this.pageStateService.setPageComplete(this.router.url, this.dataService.mspApplication.pageStatus);
      this.navigate(ROUTES_ENROL.SENDING.fullpath);
    }else{
      console.log('Auth token is not valid');
    }
  }
}
