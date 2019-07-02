import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../models/base.component';


@Component({
  selector: 'msp-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class MspToggleComponent extends BaseComponent {

  @Input() data: boolean;
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() id: string;


  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }

  //Invalid if boolean is undefined, null, etc. User must make a choice.
  isValid(): boolean {
    return this.data === true || this.data === false;
  }

  ngOnChanges(){
    this.emitIsFormValid();
  }

}
