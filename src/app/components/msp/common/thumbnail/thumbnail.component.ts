import {Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MspImage } from '../MspImage';

require('./thumbnail.less')

@Component({
  selector: 'msp-thumbnail',
  templateUrl: './thumbnail.html'
})
export class ThumbnailComponent implements OnInit {
  @Input() imageObject: MspImage;
  @Output('delete') deleteImage: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(){

  }

  delete() {
    this.deleteImage.emit(this.imageObject.id);
  }
}