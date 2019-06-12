import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MspPerson } from '../../model/msp-person.model';
import { BaseComponent } from '../../../../models/base.component';

@Component({
  selector: 'msp-name',
  templateUrl: './name.component.html'
})
export class MspNameComponent extends BaseComponent {
  // lang = require('./i18n');

  @Input() person: MspPerson;
  @Input() showError: boolean;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  Person: typeof MspPerson = MspPerson;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngAfterViewInit(): void {
    // https://github.com/angular/angular/issues/24818
    this.form.valueChanges.pipe(debounceTime(0)).subscribe(values => {
      this.onChange.emit(values);
    });
  }
}
