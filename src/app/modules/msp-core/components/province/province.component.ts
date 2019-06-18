import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { BaseComponent } from 'app/models/base.component';
import provinceData from '../../constants/provinces';
import stateData from '../../constants/states';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { countryData } from '../../constants/countries';

@Component({
  selector: 'msp-province',
  template: `
    <form #formRef="ngForm" novalidate>
      <div
        class="form-group row"
        [ngClass]="{
          'has-error':
            (province === undefined ||
              province === null ||
              province?.trim().length < 1) &&
            (provinceRef.touched || showError)
        }"
      >
        <label
          class="control-label"
          for="province{{ objectId }}"
          [innerHtml]="provinceLabel"
        ></label>

        <input
          [(ngModel)]="province"
          (typeaheadOnSelect)="updateModel($event)"
          (typeaheadOnBlur)="updateModel($event)"
          [typeahead]="provinceAndCountryData"
          typeaheadOptionField="name"
          [minlength]="1"
          [typeaheadMinLength]="0"
          [typeaheadScrollable]="false"
          [maxlength]="25"
          (typeaheadNoResults)="typeaheadNoResults($event)"
          [required]="true"
          class="form-control"
          id="province{{ objectId }}"
          name="province"
          #provinceRef="ngModel"
        />

        <div
          *ngIf="
            (provinceRef.touched || showError) &&
            (province === undefined ||
              province === null ||
              province?.length < 1)
          "
          role="alert"
          aria-live="assertive"
        >
          <div
            class="text-danger"
            *ngIf="provinceRef.errors?.required"
            [innerHtml]="lang('./en/index.js').provinceErrorIsRequired"
          ></div>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent extends BaseComponent {
  @Input() showError: boolean;
  @Input() colSize: string = 'col-md-5';
  @Input() province: string;
  /**
   * Include states from USA in the list.
   */
  @Input() hideStates: boolean;
  @Input() provinceLabel: string = 'Province';
  @Output() onChange = new EventEmitter<any>();
  /**
   * Include countries on the list.  Essentially combines MspCountryComponent
   * with MspProvinceComponent, for the cases where both data is required on one
   * input.
   */
  @Input() showCountries: boolean = false;

  provinceAndCountryData: Array<{ code: string; name: string }>;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('provinceInput') inputField: FormControl;

  handleKeyboard(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.province = '';
    }
  }
  /**
   * Use to remove BC from the list
   * @type {boolean}
   */
  @Input() exceptBC: boolean = false;

  private provinceData = provinceData;
  private stateData = stateData;
  private countryData = countryData;

  private get provinceStateData() {
    return Array().concat(this.provinceData, this.stateData);
  }

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
    let data = this.provinceData;
    if (this.hideStates === false) {
      data = Array().concat(data, this.stateData);
    }
    if (this.showCountries) {
      data = Array().concat(data, this.countryData);
    }

    this.provinceAndCountryData = data;
  }

  // to handle user typing a non-dropdown value.. used in mailing address where province cant be a drop down item for non-canada countires
  typeaheadNoResults(event: boolean): void {
    if (event) {
      this.onChange.emit(this.province.trim());
    }
  }

  updateModel(event: TypeaheadMatch): void {
    if (event && event.item) {
      const eventVal: string = event.item['name'].trim();
      this.province = eventVal;
      this.onChange.emit(eventVal);
    }
  }

  isValid(): boolean {
    if (this.province && this.province.trim().length > 0) {
      return true;
    }
    return false;
  }
}
