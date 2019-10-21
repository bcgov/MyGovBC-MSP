import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AssistStateService } from '../../services/assist-state.service';
import { ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';

@Component({
  template: `
  <common-page-framework layout="blank">
     
      <ng-container *ngIf="success">
        <!-- SUCCESS: {{ success$ | async | json }} -->
        <msp-confirmation
          [success]="true"
          [confirmationNum]="confirmationNum"
          message="Your application has been successfully submitted"
        >
            <a afterTitleSlot onclick="window.print();return false;" >
            <b class="float-right">Print <i class="fa fa-print fa-lg pointer"
              aria-hidden="true"></i>
            </b>
          </a>
        </msp-confirmation>
      </ng-container>

      <ng-container *ngIf="!success">
        <!-- FAILURE: {{ failure$ | async | json }} -->

        <msp-confirmation
          [success]="false"
          title="There was a technical issue with your submission."
          message="Your application has not been submitted"
        >
          <a afterTitleSlot onclick="window.print();return false;" >
          <b class="float-right">Print <i class="fa fa-print fa-lg pointer"
            aria-hidden="true"></i>
          </b>
        </a>
          </msp-confirmation>
      </ng-container>
    </common-page-framework>
  `,
  styleUrls: ['./confirmation.component.scss']
})
export class AssistanceConfirmationComponent implements OnInit {
  success: boolean;
  confirmationNum: string;
  subscription: Subscription;
  //success$: Observable<any> = this.stateSvc.success$.asObservable();
  //failure$: Observable<any> = this.stateSvc.failure$.asObservable();

  constructor(
    private stateSvc: AssistStateService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe(obj => {
      console.log(obj);
      this.confirmationNum = obj.id;
      this.success = obj.status === 'SUCCESS' ? true : false;

    });
  }
}
