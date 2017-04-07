import {Component, Inject, Input, Output, EventEmitter, AfterViewInit, OnInit, ViewChild} from '@angular/core'
import {Person} from "../../model/person.model";
import {NgForm} from "@angular/forms";
import {ValidationStatus} from "../../common/validation-status.interface";


@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent implements AfterViewInit, OnInit{
  lang = require('./i18n');

  @Output() isFormValid = new EventEmitter<ValidationStatus>();
  @Output() registerMspNameComponent = new EventEmitter<MspNameComponent>();

  @Input() person: Person;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  Person: typeof Person = Person;

  ngOnInit(){
    this.registerMspNameComponent.emit(this);
    
    this.form.valueChanges.subscribe(
      (values) => {
        this.isFormValid.emit({name: 'msp-name component', value: this.form.valid});
      }
    );
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }
}
