import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

require('./file-uploader.component.less')

@Component({
  selector: 'msp-file-uploader',
  templateUrl: './file-uploader.component.html'
})
export class FileUploaderComponent {
  @ViewChild('imgRef') imageElement: ElementRef;

  private trustedUrl: SafeUrl;
  private maxFileSize: number;
  private fileSize: string;
  private fileSizeUnit: string;
  private fileName: string;
  private fileSizeError: string;
  private imageFileContent:string;

  constructor(private sanitizer: DomSanitizer) {
    this.maxFileSize = 5 * 1024 * 1024;
  }
  onChange(evt: any) {
    this.trustedUrl = null;

    console.log(evt);
    let fileList = evt.srcElement.files;
    // console.log('file list size: ' + fileList.length);
    let file = fileList[0];
    let nBytes = file.size;
    this.fileName = file.name.substring(0,60);

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

      let reader = new FileReader();

      let imageEl = this.imageElement;

      reader.onload = function(e){
        let imageContent = reader.result;
        let imageObject = new Image();
        imageObject.src = imageContent;

        imageEl.nativeElement.src = imageContent;
        let h = imageObject.naturalHeight;
        let w = imageObject.naturalWidth;

        console.log('reading image height and width: ' + h + 'x' + w);
      };

      reader.readAsDataURL(file);

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

  onLoad(event: Event) {
    console.log('img onload event');
    console.log(this.imageElement.nativeElement);
    var target = event.target ? event.target : event.srcElement;
    // let image = evt.target;
    // img.src = 
    console.log('width: ' + this.imageElement.nativeElement.naturalWidth + ' and height: '
      + this.imageElement.nativeElement.naturalHeight);
  }

  get imageUrl() {
    return this.trustedUrl;
  }
}