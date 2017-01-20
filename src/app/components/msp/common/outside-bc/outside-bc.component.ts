import {Component, Inject, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnChanges} from '@angular/core'
import {Person} from "../../model/person.model";
import {NgForm} from "@angular/forms";
import {MspApplication} from "../../model/application.model";

@Component({
  selector: 'msp-outside-bc',
  templateUrl: './outside-bc.component.html'
})
export class MspOutsideBCComponent implements AfterViewInit, OnChanges {

  lang = require('./i18n');

  @Input() uuid: string;
  @Input() mspApplication: MspApplication;
  @Output() onChange = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;

  departurePersonWorking: Person;

  ngOnChanges () {
    this.familyMemberSelect(this.uuid);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  getRemainingCandidates(): Person[] {
    let persons = this.mspApplication.getOutOfProvinceFor30DayCandidatesAvailable();
    if (this.departurePersonWorking) {
      persons.push(this.departurePersonWorking);
    }
    return persons;
  }

  removeOutsideBCPerson(): void {
    this.departurePersonWorking.resetOutsideBCValues();
    this.onRemove.emit(this.uuid);
  }

  familyMemberSelect(uuid: string) {
    // If someone is changing the person, reset the working reference
    if (this.departurePersonWorking) {
      this.departurePersonWorking.resetOutsideBCValues();
    }

    if (uuid && uuid.length > 0) {

      // Find person by select value = person.uuid
      let person = this.mspApplication.findPerson(uuid);

      // Set working person
      this.departurePersonWorking = person;
      this.departurePersonWorking.outsideBC = true;
      this.uuid = uuid;
    }
    else {
      this.departurePersonWorking = null;
    }
  }
}
