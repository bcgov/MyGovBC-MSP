import {Component, ViewChild, ElementRef} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

require('./file-uploader.component.less')

@Component({
  selector: 'msp-file-uploader',
  templateUrl: './file-uploader.component.html'
})
export class FileUploaderComponent {
  @ViewChild('imgRef') imageElement: ElementRef;

  private trustedUrl:SafeUrl;
  private reader: FileReader;
  private maxFileSize: number;

  constructor(private sanitizer: DomSanitizer) {
    this.reader  = new FileReader();
    this.maxFileSize = 5*1024*1024;
  }
  onChange(evt: any){
    console.log(evt);
    let fileList = evt.srcElement.files;
    // console.log('file list size: ' + fileList.length);
    let file = fileList[0];
    let nBytes = file.size;

    if(nBytes > this.maxFileSize){
      console.error('This file was not accepted because its size exceeded max allowed file size (5MB).');
    }

    var sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    console.log('size of selected file: ' + sOutput);

    // let blob = this.reader.readAsDataURL(file);
    // console.log('file blob:');
    // console.log(blob);

    var blob_url = window.URL.createObjectURL(file);    

    let image = new Image();
    image.addEventListener('load', function(loadEvent){
      console.log('innner load event:');
      console.log(loadEvent);
      console.log(loadEvent.target);
    });

    image.src = file;
    // image.src = blob_url;
    // console.log('width: ' + image.naturalWidth + ' and height: ' + image.naturalHeight);

    this.trustedUrl = this.sanitizer.bypassSecurityTrustUrl(blob_url);;
    console.log('file blog url: ' + blob_url);
  }

  onLoad(event:Event){
    console.log('img onload event');
    console.log(this.imageElement.nativeElement);
    var target = event.target ? event.target : event.srcElement;    
    // let image = evt.target;
    // img.src = 
    console.log('width: ' + this.imageElement.nativeElement.naturalWidth + ' and height: ' 
      + this.imageElement.nativeElement.naturalHeight);
  }

  get imageUrl(){
    return this.trustedUrl;
  }
}