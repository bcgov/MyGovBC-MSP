import {
  Component,
  OnInit,
  Input,
  ViewChild,
  forwardRef,
  EventEmitter,
  Output
} from '@angular/core';
import { NgForm, NG_VALIDATORS, ControlContainer } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';

@Component({
  selector: 'msp-citizen-status',
  templateUrl: './citizen-status.component.html',
  styleUrls: ['./citizen-status.component.scss']
  // viewProviders: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: forwardRef(() => NgForm),
  //     multi: true
  //   }
  // ]
})
export class CitizenStatusComponent implements OnInit {
  @Input() label;
  @Input() id;
  @Input() items;
  @Input() selected: any;
  @Output() change: EventEmitter<number> = new EventEmitter<number>();
  items$: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    console.log('Selected item ', this.selected);
    const arr = [];
    for (const key in this.items) {
      arr.push(this.items[key]);
    }
    const selected = arr[this.selected];
    this.selected = selected;
    this.items$ = of(arr);

    console.log('selected', selected);
  }

  getValue(i: number) {
    return this.items[i];
  }
  changed(itm) {
    if (typeof itm === 'object') return;
    console.log(itm);
    const arr = [];
    for (const key in this.items) {
      arr.push(this.items[key]);
    }
    this.change.emit(itm);
    // this.change.emit(arr[itm]);
  }
}
