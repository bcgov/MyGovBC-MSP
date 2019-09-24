import { AbstractForm } from 'moh-common-lib';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { MspDataService } from '../../../services/msp-data.service';
import { PageStateService } from '../../../services/page-state.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { MspApplication } from './application.model';

export class EnrolForm extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

    // Web links
  links = environment.links;
  subscriptions: Subscription[];

  protected _nextUrl: string;
  protected _canContinue: boolean;


  constructor( protected dataService: MspDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {

      super(router);
  }


  get mspApplication(): MspApplication {
    return this.dataService.mspApplication;
  }

  ngOnInit(){
    this.pageStateService.setPageIncomplete(this.router.url, this.dataService.mspApplication.pageStatus);
  }

  ngAfterViewInit() {

    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime( 100 )
        ).subscribe(() => {
          this.dataService.saveMspApplication();
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

    this.pageStateService.setPageComplete( this.router.url, this.mspApplication.pageStatus);
    this.navigate( this._nextUrl );
  }
}
