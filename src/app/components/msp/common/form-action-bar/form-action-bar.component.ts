import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fpcare-form-action-bar',
  templateUrl: './form-action-bar.component.html',
  styleUrls: ['./form-action-bar.component.scss']
})
export class FormActionBarComponent implements OnInit {
  @Input() submitLabel: string = 'Continue';
  @Input() canContinue: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() defaultColor: boolean = true;
  @Output() btnClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onClick($event){
    if (!this.isLoading && this.canContinue){
      this.btnClick.emit($event);
    }
    $event.stopPropagation();
    return false;
  }

}
