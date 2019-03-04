import {Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import {BaseComponent} from '../base.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'msp-country',
  templateUrl: './country.component.html'
})

export class MspCountryComponent extends BaseComponent {
  lang = require('./i18n');

  /**
   * Model Inputs
   */
  @Input() showError: boolean;
  @Input() colSize: string = 'col-md-5';
  @Input() label: string = this.lang('./en/index.js').countryLabel;
  @Input() country: string;
  @Output() onChange = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;

  countryData: Array<{code: string, name: string}> = this.lang('./en/index.js').countryData;

  constructor( private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(debounceTime(0), distinctUntilChanged()).subscribe((values) => {
        if (this.country && this.country.length > 0) {
            this.onChange.emit(this.country.trim());
        }
    });
  }


    // to handle user typing a non-dropdown value..emit event.. used in mailing address where province cant be a drop down item for non-canada countires
    typeaheadNoResults(event: boolean): void {
        if (event) {
       //     this.country =  this.country.slice(0, 25);
            this.onChange.emit(this.country.trim());
        }
    }

    updateModel(event: TypeaheadMatch	): void {
        if (event && event.item) {
            const eventVal: string = event.item['name'].trim().slice(0, 25);
            this.country = eventVal;
            this.onChange.emit(eventVal);
        }
    }

    isValid(): boolean {
       if (this.country && this.country.trim().length > 0 ) {
          return true;
        } else {
          return false;
        }
    
    }

}
