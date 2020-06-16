import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { OperationActionType, MspPerson } from '../../../../components/msp/model/msp-person.model';
import { AbstractForm, scrollTo, ContainerService, PageStateService } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Relationship } from 'app/models/relationship.enum';
import { BaseForm } from '../../models/base-form';

const DOM_REFRESH_TIMEOUT = 50;

@Component({
  selector: 'msp-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})

export class ChildInfoComponent extends BaseForm implements OnInit, AfterViewInit, OnDestroy {
 // children: MspPerson[];

  constructor(public dataService: MspAccountMaintenanceDataService,
              protected router: Router,
              protected containerService: ContainerService,
              protected pageStateService: PageStateService) {
    super(router, containerService, pageStateService);
  }
  subscriptions: Subscription[];
  @ViewChild('formRef') form: NgForm;

  showChild: boolean = false;
  operation: OperationActionType;

  child: MspPerson ;
  showRemoveChild: boolean = false;
  showUpdateChild: boolean = false;

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this.router.url);
    //this.children = this.dataService.accountApp.children;
    if (this.dataService.accountApp.addedChildren.length > 0) {
        this.showChild = true;
    } else if (this.dataService.accountApp.removedChildren.length > 0) {
        this.showRemoveChild = true;
    } else if (this.dataService.accountApp.updatedChildren.length > 0) {
        this.showUpdateChild = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  ngAfterViewInit() {
    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspAccountApp();
        })
      ];
    }
  }

  addChildBtnClick(): void {
    this.showChild = true;
    this.showRemoveChild = false;
    this.showUpdateChild = false;
    this.dataService.accountApp.addChild(Relationship.Unknown);

    setTimeout(() => {
      this.scrollToChild('.add-child');
    }, DOM_REFRESH_TIMEOUT);
  }

  removeChildBtnClick(): void {
    this.showChild = false;
    this.showRemoveChild = true;
    this.showUpdateChild = false;
    this.dataService.accountApp.addRemovedChild(Relationship.Unknown);

    setTimeout(() => {
      this.scrollToChild('.remove-child');
    }, DOM_REFRESH_TIMEOUT);
  }

  updateChildBtnClick(): void {
    this.showChild = false;
    this.showRemoveChild = false;
    this.showUpdateChild = true;
    this.dataService.accountApp.addUpdatedChild(Relationship.Unknown);

    setTimeout(() => {
      this.scrollToChild('.update-child');
    }, DOM_REFRESH_TIMEOUT);
  }

  get children(): MspPerson[] {
    return this.dataService.accountApp.addedChildren;
  }

  get hasChild(): boolean {
    if (this.dataService.accountApp.addedChildren.length > 0
      || this.dataService.accountApp.removedChildren.length > 0
      || this.dataService.accountApp.updatedChildren.length > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  get removedChildren(): MspPerson[] {
    return this.dataService.accountApp.removedChildren;
  }

  get updatedChildren(): MspPerson[] {
    return this.dataService.accountApp.updatedChildren;
  }

  removeChild(idx: number, op: OperationActionType): void {
    this.dataService.accountApp.removeChild(idx, op);
  }

  get accountApp() {
    return this.dataService.accountApp;
  }

  canContinue(): boolean {
    const valid = super.canContinue();

   /* if ( this.child.hasNameChange ) {
      valid = valid ; // && this.hasNameDocuments;
    }

    if ( this.child.fullTimeStudent ) {
      valid = valid && this.child.inBCafterStudies;
    }*/
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      return;
    }
    this.navigate('/deam/contact-info');
  }

  scrollToChild(section: string) {
    const elements = document.querySelectorAll(section);
    if (elements.length > 0) {
      const el: Element = elements[0];
      const top: number = el.getBoundingClientRect().top + window.pageYOffset - 75;
      scrollTo(top);
    }
  }
}
