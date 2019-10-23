import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

import { BaseComponent } from '../../../../models/base.component';


// TODO: Should be replaced by common-date
@Component({
  selector: 'msp-birthdate',
  template: `
      <common-date
        name="dob_{{objectId}}"
        [label]="dateLabel"
        [restrictDate]="'past'"
        [(ngModel)]="person.dateOfBirth"
        (dateChange)="handleChanges($event)"
        required
      ></common-date>
  `,
  styleUrls: ['./birthdate.component.scss']
})
export class MspBirthDateComponent extends BaseComponent {

  public dateLabel = 'Birthdate';

  // Create today for comparison in check later
  today: any;
  @Input() isForAccountChange: boolean = false;
  @Input() isACL: boolean = false;
  @Input() person: MspPerson;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();

  constructor(cd: ChangeDetectorRef) {
    super(cd);
    console.log(this.person);
  }

    handleChanges(date) {

        this.onChange.emit(date);
    }
}
