import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MspImage } from '../MspImage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

require('./file-uploader.component.less');
@Component({
  selector: 'msp-file-uploader',
  templateUrl: './file-uploader.html'
})
export class FileUploaderComponent implements OnInit {
  @ViewChild('previewZone') previewZone: ElementRef;
  @ViewChild('dropZone') dropZone: ElementRef;

  private trustedUrl: SafeUrl;
  private maxFileSize: number;
  private fileSizeError: string;
  private imageFileList: Array<MspImage> = new Array<MspImage>();
  /**
   * Allow max of 12 elements.
   */
  private imageElements: Array<HTMLElement> = new Array<HTMLElement>();

  private MAX_IMAGE_COUNT:number = 12;

  constructor(private sanitizer: DomSanitizer) {
    this.maxFileSize = 5 * 1024 * 1024;
  }

  ngOnInit(): void {
    console.log('subscribe to drop event.');
    var dragOverStream =
      Observable.fromEvent<DragEvent>(this.dropZone.nativeElement, "dragover");

    /**
     * Must cancel the dragover event in order for the drop event to work. 
     */  
    dragOverStream.map(evt => {
      return event;
    }).subscribe(evt => {
      // console.log('Cancel dragover event.');
      evt.preventDefault();
    });

    var dropStream = Observable.fromEvent<DragEvent>(this.dropZone.nativeElement, "drop");

    dropStream.map(
      function (event) {
        event.preventDefault();
        return event.dataTransfer.files;
      }
    ).filter(files => {
      return !!files && files.length && files.length > 0;
    }).subscribe(
      (files) => {
        // console.log('drop event detected:');
        // console.log(files[0]);
        this.handleImageFile(files[0], this.imageFileList, this.getFileSizeOutputString);
      },

      (error) => {
        console.log('drop event error detected:');
        console.log(error);
      }
    );
  }

  handleImageFile(imageFile: File, fileList: Array<MspImage>, sizeFinder:any) {
    if(this.imageFileList.length >= this.MAX_IMAGE_COUNT){
      console.log(`Max number of image file you can upload is ${this.MAX_IMAGE_COUNT}. 
      This file ${imageFile.name} was not uploaded.` );
        return;
    }

    let reader = new FileReader();

    // let imageEl = this.imageElement;
    let previewZn = this.previewZone;
    let imageElms = this.imageElements;

    reader.onload = function (e: ProgressEvent) {

      let mspImage: MspImage = new MspImage();
      mspImage.fileContent = reader.result;
      mspImage.sizeTxt = sizeFinder(imageFile);
      mspImage.name = imageFile.name;

      let imgEl: HTMLImageElement = document.createElement('img');
      imgEl.src = reader.result;

      console.log(`image file natural height and width: 
          ${imgEl.naturalHeight} x ${imgEl.naturalWidth}`);

      mspImage.naturalHeight = imgEl.naturalHeight;
      mspImage.naturalWidth = imgEl.naturalWidth;

      fileList.push(mspImage);
      // let imageContent = reader.result;
      // let imgEl: HTMLImageElement = document.createElement('img');
      // imgEl.classList.add('preview-item');
      // imgEl.src = imageContent;

      // imageElms.push(imgEl);
      // previewZn.nativeElement.appendChild(imgEl);

      // let h = imgEl.naturalHeight;
      // let w = imgEl.naturalWidth;

      // console.log('reading image height and width: ' + h + 'x' + w);
    };

    reader.readAsDataURL(imageFile);
    // reader.readAsText(imageFile);
  }

  onChange(evt: any) {
    console.log(evt);
    if(evt.srcElement.files && evt.srcElement.files.length && evt.srcElement.files.length > 0){
      // console.log('file list size: ' + fileList.length);
      let file = evt.srcElement.files[0];
      let nBytes = file.size;
      if (nBytes > this.maxFileSize) {
        this.fileSizeError = 'This file was not accepted because its size exceeded max allowed file size (5MB).';
        console.log(this.fileSizeError);
      }else{
        this.handleImageFile(file, this.imageFileList, this.getFileSizeOutputString);
        // var blob_url = window.URL.createObjectURL(file);
        // this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(blob_url);;
        // console.log('file blog url: ' + blob_url);
      }
    }else{
      console.log('No file was selected.');
      return;
    }
  }

  getFileSizeOutputString(file: File){
      let nBytes = file.size;
      let fileSize = '';
      let fileSizeUnit = '';
      let name = file.name;
      let sOutput:string = nBytes + " bytes";
      // optional code for multiples approximation
      for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
        fileSize = nApprox.toFixed(0);
        fileSizeUnit = aMultiples[nMultiple];
      }
      console.log(`Size of file ${name}: ${sOutput}`);
      return sOutput;
  }

  createMspImage(file: File, sOutput:string, fileName:string) {
      let mspImage: MspImage = new MspImage();
      mspImage.fileContent = file;
      mspImage.sizeTxt = this.getFileSizeOutputString(file);
      mspImage.name = fileName;

      return mspImage;
  }

  // get imageUrl() {
  //   return this.trustedUrl;
  // }
}