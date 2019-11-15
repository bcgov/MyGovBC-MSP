import { Component, OnInit, Input, forwardRef, OnDestroy, Output, EventEmitter, Optional, Host } from '@angular/core';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';

// TODO: Remove once account has been updated
@Component({
  selector: 'msp-full-name',
  templateUrl: './full-name.component.html',
  styleUrls: ['./full-name.component.scss'],
  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm ) }
  ],
})
export class MspFullNameComponent implements OnDestroy {

  // TODO: Change PERSON to MspPerson extend from Person in moh-common-lib
  @Input() data: MspPerson;
  @Input() disabled: boolean = false;
  @Output() dataChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();
  // Use old behaviour of having rows for each.  Preferable to set to false. Easier to embed in designs.
  @Input() useRows = true;

  subscriptions: Subscription[];
  newObs = new Observable();

  constructor( @Optional() @Host() public parent: ControlContainer ) {

    this.newObs = of(this.data);
    this.subscriptions = [ this.newObs.subscribe() ];


    if ( parent ) {
      this.subscriptions.push( parent.valueChanges.subscribe(obs => {
        // console.log( '(full-name) parent change values: ', obs );
        this.dataChange.emit( obs );
      }) );
      // this.subscriptions.push( parent.statusChanges.subscribe( x => {
      //   console.log( '(full-name) parent change status: ', parent.status );
      // }) );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }
}
