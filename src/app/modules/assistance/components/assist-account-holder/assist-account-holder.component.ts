import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { MspPerson } from 'app/modules/account/models/account.model';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/models/base.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'msp-assist-account-holder',
  template: `
    <form #formRef="ngForm" novalidate>
      <common-name
        [(ngModel)]="person.firstName"
        label="First name"
        name="firstName"
      ></common-name>
      <common-name
        [(ngModel)]="person.middleName"
        label="Middle name(optional)"
        name="middleName"
      ></common-name>
      <common-name
        [(ngModel)]="person.lastName"
        label="Last Name"
        name="lastName"
      ></common-name>
      <msp-birthdate
        [person]="person"
        (onChange)="this.dataChange.emit(person)"
        label="Date of Birth"
        name="birthdate"
      ></msp-birthdate>
      <common-phn [(ngModel)]="person.previous_phn" name="phn"></common-phn>
      <common-sin [(ngModel)]="person.sin" name="sin"></common-sin>
    </form>
  `,
  styleUrls: ['./assist-account-holder.component.scss']
})
export class AssistAccountHolderComponent extends BaseComponent
  implements OnInit {
  @ViewChild('formRef') form: NgForm;
  @Input() person: MspPerson;
  @Output() dataChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(() => this.dataChange.emit(this.person));
    // this.assistApp.applicant.
  }
}
