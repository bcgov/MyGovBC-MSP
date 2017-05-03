import { Component, Directive, HostBinding,ElementRef, AfterContentInit, EventEmitter,
  OnChanges, OnInit, HostListener, Input, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[mspKeyboard]'
})
export class KeyboardEventListner implements AfterContentInit{
  @Input() mspKeyboard:String;
  @Output() keyboardAction:EventEmitter<string> = new EventEmitter<string>();
  @HostListener('document:keyup', ['$event']) 
  onKeyboardEnter(evt:KeyboardEvent){
    if(evt.key === this.mspKeyboard){
      this.keyboardAction.emit('Enter key pressed');
    }
  }

  // @HostListener('click', ['$event']) 
  // onClick($event:any){
  //   console.log('click event: %o', $event);
  // }

  ngAfterContentInit(){

  }
}