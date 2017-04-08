import {Component, Inject, Input, Output, EventEmitter, AfterViewInit, OnInit, ViewChild} from '@angular/core'
import {Person} from "../../model/person.model";
import {NgForm} from "@angular/forms";
// import {ValidationStatus} from "../../common/validation-status.interface";


@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent implements AfterViewInit, OnInit{
  lang = require('./i18n');

  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerMspNameComponent = new EventEmitter<MspNameComponent>();

  @Input() person: Person;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  Person: typeof Person = Person;

  ngOnInit(){
    this.registerMspNameComponent.emit(this);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(
      (values) => {
        this.onChange.emit(values);
        console.log('name component validation: %s', this.form.valid);
        this.isFormValid.emit(this.form.valid);
      }
    );
  }
}
