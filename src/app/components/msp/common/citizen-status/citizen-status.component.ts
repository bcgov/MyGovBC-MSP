import { Component, OnInit, Input, ViewChild, forwardRef } from '@angular/core';
import { NgForm, NG_VALIDATORS, ControlContainer } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';

@Component({
  selector: 'msp-citizen-status',
  templateUrl: './citizen-status.component.html',
  styleUrls: ['./citizen-status.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => NgForm),
      multi: true
    }
  ]
})
export class CitizenStatusComponent implements OnInit {
  @ViewChild('formRef') form: NgForm;
  @Input() label;
  @Input() id;
  @Input() items;
  items$: Observable<string[]>;

  // items = [
  //   'Canadian citizen',
  //   'Permanent resident',
  //   'Temporary permit holder or diplomat'
  // ];

  constructor() {}

  ngOnInit() {
    // console.log(this.items);
    // this.items.map((itm, i, arr) => {
    //   this.items$.next(itm[i]);
    // });
    const arr = [];
    for (const key in this.items) {
      arr.push(this.items[key]);
    }
    this.items$ = of(arr);
  }

  getValue(i: number) {
    return this.items[i];
  }
}
