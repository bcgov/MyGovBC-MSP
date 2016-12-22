import {Component, Inject, Input, Output, EventEmitter, AfterViewInit, ViewChild} from '@angular/core'
import {Person} from "../../model/person.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent implements AfterViewInit {

  lang = require('./i18n');

  @Input() person: Person;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }
}
