import {Component, OnInit, Input } from '@angular/core';
import { MspImage } from '../MspImage';

require('./thumbnail.less')

@Component({
  selector: 'msp-thumbnail',
  templateUrl: './thumbnail.html'
})
export class ThumbnailComponent implements OnInit {
  @Input() imageWrapper: MspImage;

  ngOnInit(){

  }
}