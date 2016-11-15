import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MspThumbnail } from './MspThumbnail';
import { Observable } from 'rxjs/Observable';
// import { fromEvent as staticFromEvent } from 'rxjs/observable/fromEvent';
// import { FromEventObservable as fromEvent } from 'rxjs/Observable/FromEventObservable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';



require('./file-uploader.component.less')

@Component({
  selector: 'msp-file-uploader',
  // templateUrl: './file-uploader.component.html',
  templateUrl: './file-uploader.html'
})
export class FileUploaderComponent implements OnInit {
  // @ViewChild('imgRef') imageElement: ElementRef;
  @ViewChild('previewZone') previewZone: ElementRef;
  @ViewChild('dropZone') dropZone: ElementRef;

  private trustedUrl: SafeUrl;
  private maxFileSize: number;
  private fileSize: string;
  private fileSizeUnit: string;
  private fileName: string;
  private fileSizeError: string;
  private imageFileContent: string;
  /**
   * Allow max of 12 elements.
   */
  private imageElements: Array<HTMLElement> = new Array<HTMLElement>();

  constructor(private sanitizer: DomSanitizer) {
    this.maxFileSize = 5 * 1024 * 1024;
  }

  ngOnInit(): void {
    console.log('subscribe to drop event.');
    var dragOverStream =
      Observable.fromEvent<DragEvent>(this.dropZone.nativeElement, "dragover");

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
      return files && files.length > 0;
    })
      .subscribe(
      (files) => {
        console.log('drop event detected:');
        console.log(files[0]);
        this.handleImageFile(files[0]);
      },

      (error) => {
        console.log('drop event error detected:');
        console.log(error);

      }

      );

    // var src = Observable.fromEvent(this.dropZone.nativeElement, "dragoverx");


    // src
    // .map(event=>{
    //   // console.log(event);
    //   // event.dataTransfer.files[0].path;
    // }).subscribe(
    //   (dropEvt) => {
    //     console.log('drop event detected');
    //     console.log(dropEvt);
    //   },
    //   (err) => {
    //     console.log('drop event error!');
    //     console.log(err);
    //   },
    //   () => {
    //     console.log('Completed drop.');
    //   }

    // );

  }


  handleImageFile(imageFile: File) {
    let reader = new FileReader();

    // let imageEl = this.imageElement;
    let previewZn = this.previewZone;
    let imageElms = this.imageElements;

    reader.onload = function (e) {
      let imageContent = reader.result;

      let imgEl = document.createElement('img');
      imgEl.classList.add('preview-item');
      imgEl.src = imageContent;

      imageElms.push(imgEl);
      previewZn.nativeElement.appendChild(imgEl);

      let h = imgEl.naturalHeight;
      let w = imgEl.naturalWidth;

      console.log('reading image height and width: ' + h + 'x' + w);
    };

    reader.readAsDataURL(imageFile);
  }

  onChange(evt: any) {
    this.trustedUrl = null;

    console.log(evt);
    let fileList = evt.srcElement.files;
    // console.log('file list size: ' + fileList.length);
    let file = fileList[0];
    let nBytes = file.size;
    this.fileName = file.name.substring(0, 60);

    var sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
      this.fileSize = nApprox.toFixed(0);
      this.fileSizeUnit = aMultiples[nMultiple];
    }
    console.log('size of selected file: ' + sOutput);
    if (nBytes > this.maxFileSize) {
      this.fileSizeError = 'This file was not accepted because its size exceeded max allowed file size (5MB).';
    } else {
      this.handleImageFile(file);
      var blob_url = window.URL.createObjectURL(file);
      // let blob = this.reader.readAsDataURL(file);
      // console.log('file blob:');
      // console.log(blob);


      // let image = new Image();
      // image.addEventListener('load', function (loadEvent) {
      //   console.log('innner load event:');
      //   console.log(loadEvent);
      //   console.log(loadEvent.target);
      // });

      // image.src = file;
      // image.src = blob_url;
      // console.log('width: ' + image.naturalWidth + ' and height: ' + image.naturalHeight);

      this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(blob_url);;
      console.log('file blog url: ' + blob_url);
    }

  }

  get imageUrl() {
    return this.trustedUrl;
  }
}