import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

import { BaseComponent } from '../../../../models/base.component';

@Component({
  selector: 'msp-birthdate',
  template: `
      <common-date
        [label]="dateLabel"
        [restrictDate]="'past'"
        [(date)]="person.dateOfBirth"
        (dateChange)="handleChanges($event)"
      ></common-date>
  `,
  styleUrls: ['./birthdate.component.scss']
})
export class MspBirthDateComponent extends BaseComponent {

  public dateLabel = 'Date of Birth';

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
        if (this.person.dateOfBirth) {
            if (this.person.dateOfBirth.month) {
                this.person.dob_month = this.person.dateOfBirth.month;
            }
            if (this.person.dateOfBirth.day) {
                this.person.dob_day = this.person.dateOfBirth.day;
            }
            if (this.person.dateOfBirth.year) {
                this.person.dob_year = this.person.dateOfBirth.year;
            }
        }


        this.onChange.emit(date);
    }

  ngAfterViewInit(): void {
    this.person.dateOfBirth = {
      year: this.person.dob_year,
      month: this.person.dob_month,
      day: this.person.dob_day
    };
  }
}
