import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StatusInCanada, StatusRules} from '../../../model/status-activities-documents';
import * as moment from 'moment';
import {BaseComponent} from '../../../common/base.component';
import {Person} from '../../../model/person.model';

@Component({
    selector: 'msp-tax-year',
    templateUrl: './tax-year.component.html',
    styleUrls: ['./tax-year.component.scss']
})
/**
 * this is a component to support current year or previous tax year.
 * This component has to grow and fetch the tax year either from RAPID OR some other mechanism.
 *
 */
export class TaxYearComponent extends BaseComponent {

    lang = require('./i18n');
    taxYears: number[] ;
    @Input() currentTaxYear: boolean;
    @Output() onTaxYearChange: EventEmitter<number> = new EventEmitter<number>();

    constructor(cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.taxYears = this.getTaxYears ();
    }
    setTaxYear(value: number) {
        this.onTaxYearChange.emit(value);
    }
    getTaxYears(): number[] {
        const currentTaxYear = moment().year() - 1 ;
        return [currentTaxYear, currentTaxYear - 1 ];
    }

    isValid(): boolean {
        return !!this.currentTaxYear ;
    }

}
