import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'msp-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.less']
})
export class ToggleComponent implements OnInit {

  @Input() data: boolean;
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
