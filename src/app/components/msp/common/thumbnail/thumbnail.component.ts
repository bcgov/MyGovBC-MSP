import {Component, ViewChild, OnInit, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import { MspImage } from '../../model/msp-image';

@Component({
  selector: 'msp-thumbnail',
  templateUrl: './thumbnail.html',
  styleUrls: ['./thumbnail.scss']
})
export class MspThumbnailComponent implements OnInit {
  @Input() imageObject: MspImage;
  @Input() reviewMode: boolean = false;
  @Output('delete') deleteImage: EventEmitter<MspImage> = new EventEmitter<MspImage>();
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;

  private viewContainerRef: ViewContainerRef;
  constructor(viewContainerRef: ViewContainerRef){
    this.viewContainerRef = viewContainerRef;
  }

  scaledWidth: number = 300;
  ngOnInit(){

    const scaledWidthString: string = (180 * this.imageObject.naturalWidth / this.imageObject.naturalHeight).toFixed(0);
    // console.log('scaled width: ' + scaledWidthString);
    this.scaledWidth = parseInt(scaledWidthString);

    if (this.scaledWidth > 250){
      // console.log('Scaled width > 250, drop it down to 250');
      this.scaledWidth = 250;
    }else if (this.scaledWidth < 30){
      this.scaledWidth = 100;
    }

    if (isNaN(this.scaledWidth)){
      this.scaledWidth = 300;
    }
  }

  delete(evt: any) {
      console.log('ThumbnailComponent:Delete from thumbnail: %o', evt);
      console.log('ThumbnailComponent:imageObject:', JSON.stringify(this.imageObject, null , 2));
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
