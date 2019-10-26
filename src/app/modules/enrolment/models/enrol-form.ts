import { AbstractForm } from 'moh-common-lib';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { PageStateService } from '../../../services/page-state.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { EnrolDataService } from '../services/enrol-data.service';
import { EnrolApplication } from './enrol-application';

export class EnrolForm extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

    // Web links
  links = environment.links;
  subscriptions: Subscription[];

  protected _nextUrl: string;
  protected _canContinue: boolean;


  constructor( protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {

    super(router);
  }


  get mspApplication(): EnrolApplication {
    return this.enrolDataService.application;
  }

  ngOnInit(){
    this.pageStateService.setPageIncomplete(this.router.url, this.enrolDataService.pageStatus);
  }

  ngAfterViewInit() {

    if ( this.form ) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime( 100 )
        ).subscribe(() => {
          this.enrolDataService.saveApplication();
        })
      ];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

   // abstract function must be defined
  continue() {

    console.log( '(super.continue) : this._canContinue: ', this._canContinue );
    if ( !this._canContinue ) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.pageStateService.setPageComplete( this.router.url, this.enrolDataService.pageStatus);
    this.navigate( this._nextUrl );
  }
}
