import { Component } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AssistStateService } from '../../services/assist-state.service';

@Component({
  template: `
    <ng-container *ngIf="success$ | async as success">
      SUCCESS: {{ success | json }}
      <msp-confirmation
        [success]="true"
        [confirmationNum]="success.op_reference_number"
        message="Your application has been successfully submitted"
      >
      </msp-confirmation>
    </ng-container>

    <ng-container *ngIf="failure$ | async as failure">
      FAILURE: {{ failure | json }}

      <msp-confirmation
        [success]="false"
        title="There was a technical issue with your submission."
        message="Your application has not been submitted"
      ></msp-confirmation>
    </ng-container>
  `,
  styleUrls: ['./confirmation.component.scss']
})
export class AssistanceConfirmationComponent {
  confirmationNum: string;
  subscription: Subscription;
  success$: Observable<any> = this.stateSvc.success$.asObservable();
  failure$: Observable<any> = this.stateSvc.failure$.asObservable();

  constructor(private stateSvc: AssistStateService) {}
}
