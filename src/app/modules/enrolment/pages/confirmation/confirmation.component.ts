import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiStatusCodes } from 'moh-common-lib';
import { format } from 'date-fns';
@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  confirmationNum: string;
  status: ApiStatusCodes = ApiStatusCodes.ERROR;
  nextSteps: any;
  message: string;

  private subscription: Subscription;

  links = environment.links;

  constructor( private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(
      params => {
        const statusCode = params['status'];
        if ( statusCode ) {
          this.status = statusCode;
        }

        this.confirmationNum = params['confirmationNum'];

        this.nextSteps = params['nextSteps'];
        this.message = params['message'];

        console.log( 'params: ', params );
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get isSucess() {
    return this.status === ApiStatusCodes.SUCCESS;
  }

  /**
   * Today's date
   * @returns {string}
   */
  get dateStamp(): string {
    return format(new Date(), 'MMMM dd, yyyy');
  }

}
