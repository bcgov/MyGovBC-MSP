import {Component, ViewChild, ElementRef, OnInit, EventEmitter, ViewContainerRef, Output, Input} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MspImage } from '../../model/msp-image';
import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/subject';
// import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/filereader';
// import Rx from 'rx-dom';

var sha1 =  require('sha1');

require('./file-uploader.component.less');
@Component({
  selector: 'msp-file-uploader',
  templateUrl: './file-uploader.html'
})
export class FileUploaderComponent implements OnInit {
  lang = require('./i18n');

  @ViewChild('previewZone') previewZone: ElementRef;
  @ViewChild('dropZone') dropZone: ElementRef;
  @ViewChild('browseFileRef') browseFileRef: ElementRef;
  @ViewChild('captureFileRef') captureFileRef: ElementRef;
  
  private trustedUrl: SafeUrl;
  private maxFileSize: number;
  private fileSizeError: string;
  private MAX_IMAGE_COUNT:number = 12;
  
  @Input() images: Array<MspImage>;
  @Input() id: string;

  @Output() onAddDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();
  @Output() onDeleteDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();
  constructor(private sanitizer: DomSanitizer, 
    private viewContainerRef: ViewContainerRef) {
    this.maxFileSize = 8 * 1024 * 1024;
  }

  ngOnInit(): void {
    // console.log('subscribe to drop event.');
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

    var filesArrayFromDrop = dropStream.map(
      function (event) {
        event.preventDefault();
        return event.dataTransfer.files;
      }
    )
    
    var browseFileStream = Observable.fromEvent<Event>(this.browseFileRef.nativeElement, 'change');
    var captureFileStream = Observable.fromEvent<Event>(this.captureFileRef.nativeElement, 'change');

    var filesArrayFromInput = browseFileStream.merge(captureFileStream)
    .map(
      (event) => {
        event.preventDefault();
        return event.target['files'];
      }
    ).merge(filesArrayFromDrop)
    .filter(files => {
      return !!files && files.length && files.length > 0;
    }).filter((files)=>{
      return files[0].size <= this.maxFileSize;
    }).flatMap(
      (fileList:FileList) => {
        return this.observableFromFile(fileList[0]);
      }
    ).do(
      (mspImage:MspImage) => {
        this.onAddDocument.emit(mspImage);
      }
    )
    .subscribe(
      (file:MspImage) => {
        // console.log('drop event detected:');
        // console.log(files[0]);
        this.handleImageFile(file);
      },

      (error) => {
        console.log('drop event error detected:');
        console.log(error);
      }
    );
  }

  observableFromFile(file:File){
    let reader:FileReader = new FileReader();

    let fileObservable = Observable.create((observer:any) => {
      reader.onload = function(evt:any) {
        let mspImage: MspImage = new MspImage();
        mspImage.fileContent = reader.result;
        mspImage.id = sha1(reader.result);
        console.log(`generated file id: ${mspImage.id}`);

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
        mspImage.sizeTxt = sOutput;
        mspImage.name = file.name;
        
        let imgEl: HTMLImageElement = document.createElement('img');
        imgEl.src = reader.result;

        console.log(`image file natural height and width: 
            ${imgEl.naturalHeight} x ${imgEl.naturalWidth}`);

        mspImage.naturalHeight = imgEl.naturalHeight;
        mspImage.naturalWidth = imgEl.naturalWidth;
        
        observer.next(mspImage);
        observer.complete();
      }
    });

    reader.readAsDataURL(file);

    return fileObservable;
  }

  handleImageFile(mspImage: MspImage) {
      console.log('image file from observable: %o', mspImage);
    if(this.images.length >= this.MAX_IMAGE_COUNT){
      console.log(`Max number of image file you can upload is ${this.MAX_IMAGE_COUNT}. 
      This file ${mspImage.name} was not uploaded.` );
        return;
    }

    // let alreadyUploaded = this.checkImageExists(file., this.images);
    
  }


  handleImageFile2(imageFile: File, 
    sizeFinder:Function, imageDuplicationCheck:Function, imageList: Array<MspImage>) {
    if(this.images.length >= this.MAX_IMAGE_COUNT){
      console.log(`Max number of image file you can upload is ${this.MAX_IMAGE_COUNT}. 
      This file ${imageFile.name} was not uploaded.` );
        return;
    }

    let reader = new FileReader();
    // var subject = new ReplaySubject(1)
    // let imageEl = this.imageElement;
    let previewZn = this.previewZone;

    reader.onload = function (e: ProgressEvent) {
      let alreadyUploaded = imageDuplicationCheck(reader.result, imageList);
      if(alreadyUploaded){
        console.log(`This file, ${imageFile.name}(or a file of thes same image) has already been uploaded.
        This file was therefore not uploaded as a duplicate of that previous file.`);

        return;
      }

      let mspImage: MspImage = new MspImage();
      mspImage.fileContent = reader.result;
      mspImage.id = sha1(reader.result);
      console.log(`generated file id: ${mspImage.id}`);
      mspImage.sizeTxt = sizeFinder(imageFile);
      mspImage.name = imageFile.name;

      let imgEl: HTMLImageElement = document.createElement('img');
      imgEl.src = reader.result;

      console.log(`image file natural height and width: 
          ${imgEl.naturalHeight} x ${imgEl.naturalWidth}`);

      mspImage.naturalHeight = imgEl.naturalHeight;
      mspImage.naturalWidth = imgEl.naturalWidth;

      imageList.push(mspImage);
    };

    reader.readAsDataURL(imageFile);
    // reader.readAsText(imageFile);
  }

  // onChange(evt: any) {
  //   // console.log(evt);
  //   if(evt.srcElement.files && evt.srcElement.files.length && evt.srcElement.files.length > 0){
  //     // console.log('file list size: ' + fileList.length);
  //     let file = evt.srcElement.files[0];
  //     let nBytes = file.size;
  //     if (nBytes > this.maxFileSize) {
  //       this.fileSizeError = 'This file was not accepted because its size exceeded max allowed file size (8MB).';
  //       console.log(this.fileSizeError);
  //     }else{
  //       this.handleImageFile(file, 
  //         this.getFileSizeOutputString, this.checkImageExists, this.images);
  //       // var blob_url = window.URL.createObjectURL(file);
  //       // this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(blob_url);;
  //       // console.log('file blog url: ' + blob_url);
  //     }
  //   }else{
  //     console.log('No file was selected.');
  //     return;
  //   }
  // }

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

  deleteImage(mspImage:MspImage){
    this.onDeleteDocument.emit(mspImage);
    // for(var i = this.images.length -1; i >= 0 ; i--){
    //     if(this.images[i].id === imageId){
    //         this.images.splice(i, 1);
    //     }
    // }    
  }

  /**
   * Return true if file already exists in the list; false otherwise.
   */
  checkImageExists(fileContent: string, imageList: Array<MspImage>) {
    if(!imageList){
      return false;
    }else{
      let sha1Sum = sha1(fileContent);
      for(var i = imageList.length -1; i >= 0 ; i--){
        // console.log(`compare  ${imageList[i].id} with ${sha1Sum}, result ${imageList[i].id === sha1Sum}`);
          if(imageList[i].id === sha1Sum){
            return true;
          }
      }    
      return false;
    }
  }

  /**
   * Get the current image count
   */
  imageCount() {
    return this.images.length;
  }

  get MAX_NUM_IMAGES(): number{
    return this.MAX_IMAGE_COUNT;
  }

}