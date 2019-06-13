import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { assistPages } from '../../assist-page-routing.module';
import { Container } from 'moh-common-lib';

@Component({
  selector: 'msp-assist-container',
  templateUrl: './assist-container.component.html',
  styleUrls: ['./assist-container.component.scss']
})
export class AssistContainerComponent extends Container implements OnInit {

  constructor( public router: Router ) {
    super();
    this.setProgressSteps( assistPages );
  }

  ngOnInit() {
  }
}
