import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { MspPerson } from 'app/modules/account/models/account.model';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/models/base.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AssistStateService } from '../../services/assist-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'msp-assist-account-holder',
  template: `
    <form #formRef="ngForm" novalidate>
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
          label="Middle name(optional)"
          name="middleName"
          commonValidateName
        ></common-name>
      </div>
      <div class="form-group">
        <common-name
          [(ngModel)]="person.lastName"
          maxlen="30"
          label="Last Name"
          name="lastName"
          id="lastName"
          required
          commonValidateName
        ></common-name>
      </div>
      <div class="form-group">
        <msp-birthdate
          [person]="person"
          (onChange)="this.dataChange.emit(person)"
          label="Date of Birth"
          name="birthdate"
          id="birthdate"
          required
        ></msp-birthdate>
      </div>
      <div class="form-group">
        <common-phn
          [(ngModel)]="person.previous_phn"
          (ngModelChange)="sinChange()"
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
    </form>
  `,
  styleUrls: ['./assist-account-holder.component.scss']
})
export class AssistAccountHolderComponent extends BaseComponent
  implements OnInit, OnDestroy {
  @ViewChild('formRef') form: NgForm;
  @Input() person: MspPerson;
  @Output() dataChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  subscriptions: Subscription[] = [];

  constructor(cd: ChangeDetectorRef, private stateSvc: AssistStateService) {
    super(cd);
  }

  ngOnInit() {
    setTimeout(
      () =>
        this.subscriptions.push(
          this.stateSvc.touched.asObservable().subscribe(obs => {
            if (obs) {
              const controls = this.form.form.controls;
              for (let control in controls) {
                controls[control].markAsTouched();
              }
            }
          })
        ),
      500
    );
    this.subscriptions.push(
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
    );
    // this.assistApp.applicant.
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sinChange() {}
}
