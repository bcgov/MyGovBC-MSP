import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Person } from '../../model/person.model';
import { Relationship, StatusInCanada, CancellationReasons } from '../../model/status-activities-documents';

@Component({
  selector: 'msp-remove-dependent',
  templateUrl: './remove-dependents.component.html',
  styleUrls: ['./remove-dependents.component.less']
})
export class RemoveDependentComponent {
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;
  CancellationReasons: typeof CancellationReasons = CancellationReasons;
  public showOtherCancellationReason: boolean = false;

  Person: typeof Person = Person;
  @Input() person: Person;
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  /** The element we focus on when this component is inited, for a11y. */
  @ViewChild('firstFocus') firstFocus: ElementRef;
  public showError: boolean = false;
  lang = require('./i18n');

  constructor() { }

  change($event) {
    this.onChange.emit();
  }

  ngAfterViewInit() {
    this.firstFocus.nativeElement.focus();
  }

  cancelDependentRemoval() {
    this.onCancel.emit();
  }

  /**
   * Returns an iterable array of Cancellation reasons, with the `prop` value
   * being the programmatic property name of CancellationRequests.
   * 
   * @example
   * ```
   *    [
   *      {
   *        index: 0,
   *        prop: "NoLongerInFulLTimeStudies"
   *      }
   *    ]
   * ```
   */
  get cancellationReasonsIterable() {
    //CancellationReasons has duplicate keys, so only count half.
    return Object.keys(CancellationReasons)
    .filter(x => isNaN(Number(x)))
    .map((x, i) => {return {index: i, prop: x}});
  }

  set reasonForCancellation(val: string){
    this.person.reasonForCancellation = val;
  }

  /**
   * Essentially this is a wrapper for person.reasonForCancellation, but it has
   * special logic regarding "Other", as when the user selects "Other" we have
   * to show a text box allowing the user to select a custom string while
   * "Other" must remain shown in the <select> dropdown.
   */
  get reasonForCancellation(){
    const defaultOptions = this.cancellationReasonsIterable
    .map(x => x.prop).concat(null);

    const isDefaultOption = defaultOptions.indexOf(this.person.reasonForCancellation) >= 0;

    if (isDefaultOption) {
      return this.person.reasonForCancellation;
    }
    else {
      return "Other";
    }

  }

  onChangeReasonForCancellation(event: string){
    this.showOtherCancellationReason = event.toLowerCase() === "other";

    if (!this.showOtherCancellationReason){
      this.person.reasonForCancellation = event;
    }
    else {
      this.person.reasonForCancellation = '';
    }
  }
}
