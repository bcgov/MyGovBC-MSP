import { Component, OnInit, Input, ViewChild, forwardRef } from '@angular/core';
import { NgForm, NG_VALIDATORS, ControlContainer } from '@angular/forms';

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

  items = [
    'Canadian citizen',
    'Permanent resident',
    'Temporary permit holder or diplomat'
  ];

  constructor() {}

  ngOnInit() {}
}
