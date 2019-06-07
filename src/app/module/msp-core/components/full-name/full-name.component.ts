import { Component, OnInit, Input, forwardRef, OnDestroy, Output, EventEmitter, Optional, Host } from '@angular/core';
import { Person } from '../../../../components/msp/model/person.model';
import { ControlContainer, NgForm } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';

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
  @Input() data: Person;
  @Input() disabled: boolean = false;
  @Output() dataChange: EventEmitter<Person> = new EventEmitter<Person>();

  subscriptions: Subscription[];
  newObs = new Observable();

  constructor( @Optional() @Host() public parent: ControlContainer ) {

    this.newObs = of(this.data);
    this.subscriptions = [ this.newObs.subscribe(obs => console.log(obs) ) ];

    if ( parent ) {
      this.subscriptions.push( parent.valueChanges.subscribe(obs => {
        console.log( '(full-name) parent change values: ', obs );
        this.dataChange.emit( obs );
      }) );
      this.subscriptions.push( parent.statusChanges.subscribe( x => {
        console.log( '(full-name) parent change status: ', parent.status );
      }) );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }
}
