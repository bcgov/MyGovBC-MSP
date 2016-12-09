import { Component } from '@angular/core';
import {MspApplication} from "../../model/application.model";

import DataService from '../../service/msp-data.service';
import {Gender, Person} from "../../model/person.model";
import {StatusInCanada, Activities, Relationship} from "../../model/status-activities-documents";

@Component({
  templateUrl: './review.component.html'
})
export class ReviewComponent {
  lang = require('./i18n');

  application: MspApplication;

  constructor(private dataService: DataService) {
    this.application = this.dataService.getMspApplication();

    this.application.addSpouse(new Person(Relationship.Spouse));
    this.application.spouse.firstName = "Jackie";
    this.application.spouse.lastName = "Turner";


    this.application.addChild(Relationship.Child19To24);
    this.application.children[0].firstName = "Sam";
    this.application.children[0].lastName = "Turner";

    this.application.addChild(Relationship.Child19To24);
    this.application.children[1].firstName = "Ben";
    this.application.children[1].lastName = "Turner";

    this.application.addChild(Relationship.Child19To24);
    this.application.children[2].firstName = "Bob";
    this.application.children[2].lastName = "Turner";

  }

}