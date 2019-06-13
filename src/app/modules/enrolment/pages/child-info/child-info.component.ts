import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})
export class ChildInfoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

/*
      <msp-personal-details *ngFor = "let child of children; let idx = index"
        [person] = 'child'
        [id] = 'child.id'
        (notifyChildRemoval)="removeChild($event,idx)"
        (onChange) = "onChange($event)"
        [showError] = "formRef.submitted">
      </msp-personal-details>

*/
