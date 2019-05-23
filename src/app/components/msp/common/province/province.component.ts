import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

@Component({
  selector: 'msp-province',
  templateUrl: './province.component.html'
})
export class MspProvinceComponent extends BaseComponent implements OnInit {
  lang = require('./i18n');

  @Input() showError: boolean;
  @Input() colSize: string = 'col-md-5';
  @Input() province: string;
  /**
   * Include states from USA in the list.
   */
  @Input() hideStates: boolean;
  @Input() provinceLabel: string = this.lang('./en/index.js').provinceLabel;
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

  private provinceData = this.lang('./en/index.js').provinceData;
  private stateData = this.lang('./en/index.js').stateData;
  private countryData = this.lang('./en/index.js').countryData;

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
    console.log(data);
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
    const res = this.provinceAndCountryData.filter(
      itm => itm.name === this.province
    );
    if (this.province && this.province.trim().length > 0 && res.length > 0) {
      return true;
    }
    return false;
  }
}
