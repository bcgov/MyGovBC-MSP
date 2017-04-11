import {DoCheck, EventEmitter, Output, QueryList, SimpleChanges} from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import {NgForm} from "@angular/forms";
import {UUID} from "angular2-uuid";

export class ValidEvent {
  id: string;
  isValid: boolean;
}

/**
 * Generally, the base class fills a gap in AngularJS 2 framework with nested components raising form errors.
 *
 * This class implements form validation and all this is required to subscribe to child events, validate a form,
 * custom validation and emit to a parent.
 *
 * If you want to listen to child BaseComponent, you MUST declare them as a @ViewChild in the extended class
 * If you want the form validated, you MUST declare the NgForm as a @ViewChild in the extended class
 * If you want custom validation in the extended class, implement isValid():boolean
 */
export class BaseComponent implements DoCheck {

  /**
   * An identifier for parents to keep track of components
   * @type {string}
   */
  objectId:string = UUID.UUID().toString();

  @Output() isFormValid = new EventEmitter<ValidEvent>();
  @Output() registerComponent = new EventEmitter<BaseComponent>();
  @Output() unRegisterComponent = new EventEmitter<BaseComponent>();

  //private
  subscriptionList:Subscription[] = [];
  private validationMap = {};
  private myFormValid:boolean = true;

  /**
   * Wire up all children and self by looking for properties of type BaseComponent
   */
  ngAfterViewInit() {

    // First register the children
    this.registerChildren();

    // Listen to NgForm members of this form
    let propertyNames = Object.getOwnPropertyNames(this);
    propertyNames.forEach((property:string) => {
      if (this[property] instanceof NgForm) {
        let form:NgForm = this[property];

        this.myFormValid = form.valid;
        this.emitIsFormValid();

        form.valueChanges.subscribe(() => {
            this.myFormValid = form.valid;
            this.emitIsFormValid();
          }
        );
      }
    });

    // Register self with parent
    this.registerComponent.emit(this);
  }

  private registerChildren () {
    // Listen for children registering themselves
    let propertyNames = Object.getOwnPropertyNames(this);
    propertyNames.forEach((property:string) => {
      // If the child is a single instance
      if (this[property] instanceof BaseComponent) {
        let child:BaseComponent = this[property];
        this.registerBaseComponent(child);
      }
      // If the children is in a collection
      else if (this[property] instanceof QueryList) {
        let children:QueryList<BaseComponent> = this[property];
        children.forEach((child:BaseComponent) => {
          this.registerBaseComponent(child);
        });
      }
    });
  }

  /**
   * Registers a subscription and validation value for each child base component
   * @param comp
   */
  private registerBaseComponent(comp:BaseComponent) {
    if (this.validationMap[comp.objectId] == null) {
      console.log(this.constructor.name + " is adding: " + comp.constructor.name + " in state: " + comp.isAllValid());
      this.validationMap[comp.objectId] = comp.isAllValid();
      this.emitIsFormValid();
      this.subscriptionList.push(comp.isFormValid
        .subscribe( (event:ValidEvent) => {
          this.validationMap[event.id] = event.isValid;
          this.emitIsFormValid();
        }));
    }
  }

  /**
   * Monitors changes on component, i.e., ngIf, and re-registers children if not included already
   * @param changes
   */
  ngDoCheck () {
    this.registerChildren();
  }

  /**
   * A common function to emit the status of the form
   */
  private emitIsFormValid () {
    console.log(this.constructor.name + ": children: " + this.childrenIsValid() + "(" + Object.keys(this.validationMap).length
      + "); myFormValid: " + this.myFormValid +
      "; this.isValid: " + this.isValid());
    this.isFormValid.emit({id: this.objectId, isValid: this.isAllValid()});
  }

  /**
   * A placeholder to derive in inherited component to provide custom validation beyond templates
   * @returns {boolean}
   */
  isValid():boolean { return true; }

  /**
   * Validates all children
   * @returns {boolean}
   */
  childrenIsValid (): boolean {

    for (let item of Object.values(this.validationMap)) {
      if (item === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Combines all validations
   * @returns {boolean}
   */
  isAllValid():boolean {
    return this.childrenIsValid() && this.myFormValid && this.isValid();
  }

  /**
   * On destroym, unsubcribed and init self
   */
  ngOnDestroy(){
    this.unsubscribeAll();
    this.validationMap = {};
    this.myFormValid = true;
    this.unRegisterComponent.emit(this);
  }

  /**
   * A function to unsubscribed to all children events
   */
  unsubscribeAll(){
    this.subscriptionList.forEach(
      (sub:Subscription) => {
        sub.unsubscribe();
      }
    );
  }

  debug() {

  }
}
