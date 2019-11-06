import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnDestroy,
  forwardRef
} from '@angular/core';
import { NgForm, ControlContainer } from '@angular/forms';
import { BaseComponent } from 'app/models/base.component';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

@Component({
  selector: 'msp-assist-account-holder',
  template: `
    <div class="form-group">
      <common-name
        [(ngModel)]="person.firstName"
        maxlen="30"
        label="First name"
        name="firstName"
        id="firstName"
        required
        commonValidateName
      ></common-name>
    </div>
    <div class="form-group">
      <common-name
        [(ngModel)]="person.middleName"
        maxlen="30"
        label="Middle name (optional)"
        name="middleName"
        commonValidateName
      ></common-name>
    </div>
    <div class="form-group">
      <common-name
        [(ngModel)]="person.lastName"
        maxlen="30"
        label="Last name"
        name="lastName"
        id="lastName"
        required
        commonValidateName
      ></common-name>
    </div>
    <div class="form-group">
      <common-date
        name="birthdate"
        id="birthdate"
        label="Date of Birth"
        [(ngModel)]="person.dateOfBirth"
        [restrictDate]="'past'"
        required
      ></common-date>
    </div>
    <div class="form-group">
      <common-phn
        [(ngModel)]="person.previous_phn"
        name="phn"
        id="phn"
        required
        commonValidatePhn
      ></common-phn>
    </div>
    <div class="form-group">
      <common-sin
        [(ngModel)]="person.sin"
        name="sin"
        id="sin"
        required
        commonValidateSin
      ></common-sin>
    </div>
  `,
  styleUrls: ['./assist-account-holder.component.scss'],
    /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class AssistAccountHolderComponent extends BaseComponent
  implements OnInit, OnDestroy {
  @Input() person: MspPerson;
  @Output() dataChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

 // subscriptions: Subscription[] = [];

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
 /*   this.subscriptions.push(
      this.form.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged()
        )
        .subscribe(obs => {
          // console.log(obs);
          // this.person.sin = obs.sin.replace(/ /g, '');
          this.dataChange.emit(this.person);
        })
    );*/
    // this.assistApp.applicant.
  }

  ngOnDestroy() {
   // this.subscriptions.forEach(sub => sub.unsubscribe());
  }

 // sinChange() {}
}
