import {Component, ViewChild, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { MspImage } from '../MspImage';

require('./thumbnail.less')

@Component({
  selector: 'msp-thumbnail',
  templateUrl: './thumbnail.html'
})
export class ThumbnailComponent implements OnInit {
  @Input() imageObject: MspImage;
  @Output('delete') deleteImage: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;

  private viewContainerRef: ViewContainerRef;
  constructor(viewContainerRef: ViewContainerRef){
    this.viewContainerRef = viewContainerRef;
  }
  ngOnInit(){

  }

  delete() {
    this.deleteImage.emit(this.imageObject.id);
  }

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false
    this.fullSizeViewModal.show();
  }

  hideFullSizeView(){
    this.fullSizeViewModal.hide();
  }
  
}