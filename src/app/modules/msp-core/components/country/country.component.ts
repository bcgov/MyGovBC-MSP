import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { BaseComponent } from 'app/models/base.component';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { countryData } from '../../constants/countries';

@Component({
  selector: 'msp-country',
  template: `
    <form #formRef="ngForm" novalidate>
      <div
        class="row"
        [ngClass]="{
          'has-error':
            (country === undefined ||
              country === null ||
              country?.trim().length < 1) &&
            (countryRef.touched || showError)
        }"
      >
        <label
          for="country{{ objectId }}"
          [innerHtml]="label"
          class="control-label"
        ></label>

        <input
          [(ngModel)]="country"
          placeholder="Canada"
          (typeaheadOnSelect)="updateModel($event)"
          (typeaheadOnBlur)="updateModel($event)"
          [typeahead]="countryData"
          typeaheadOptionField="name"
          [minlength]="1"
          [typeaheadMinLength]="0"
          [typeaheadScrollable]="false"
          [maxlength]="25"
          (typeaheadNoResults)="typeaheadNoResults($event)"
          [required]="true"
          class="form-control"
          id="country{{ objectId }}"
          name="country"
          #countryRef="ngModel"
        />

        <div
          *ngIf="countryRef.touched || showError"
          role="alert"
          aria-live="assertive"
        >
          <div class="text-danger" innerHtml="Country is required"></div>
          <div
            class="text-danger"
            innerHtml="A valid country is required"
          ></div>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./country.component.scss']
})
export class CountryComponent extends BaseComponent {
  // lang = require('./i18n');

  /**
   * Model Inputs
   */
  @Input() showError: boolean;
  @Input() colSize: string = 'col-md-5';
  @Input() label: string = 'Country';
  @Input() country: string;
  @Output() onChange = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;

  countryData: Array<{ code: string; name: string }>;

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
    // this.countryData = countryData;
  }

  ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(0),
        distinctUntilChanged()
      )
      .subscribe(values => {
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

  updateModel(event: TypeaheadMatch): void {
    if (event && event.item) {
      const eventVal: string = event.item['name'].trim().slice(0, 25);
      this.country = eventVal;
      this.onChange.emit(eventVal);
    }
  }

  isValid(): boolean {
    if (this.country && this.country.trim().length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
