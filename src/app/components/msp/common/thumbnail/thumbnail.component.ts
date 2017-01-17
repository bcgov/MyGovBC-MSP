import {Component, ViewChild, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { MspImage } from '../../model/msp-image';

require('./thumbnail.less')

@Component({
  selector: 'msp-thumbnail',
  templateUrl: './thumbnail.html'
})
export class ThumbnailComponent implements OnInit {
  @Input() imageObject: MspImage;
  @Input() reviewMode: boolean = false;
  @Output('delete') deleteImage: EventEmitter<MspImage> = new EventEmitter<MspImage>();
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;

  private viewContainerRef: ViewContainerRef;
  constructor(viewContainerRef: ViewContainerRef){
    this.viewContainerRef = viewContainerRef;
  }

  scaledWidth:number = 300;
  ngOnInit(){
    let scaledWidthString:string = (180*this.imageObject.naturalWidth/this.imageObject.naturalHeight).toFixed(0);
    // console.log('scaled width: ' + scaledWidthString);
    this.scaledWidth = parseInt(scaledWidthString);
  }

  delete(evt:any) {
    // console.log('Delete from thumbnail: %o', evt);
    this.deleteImage.emit(this.imageObject);
  }

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.show();
  }

  hideFullSizeView(){
    this.fullSizeViewModal.hide();
  }
  
}