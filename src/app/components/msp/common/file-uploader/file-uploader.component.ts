import {
  Component, ViewChild, ElementRef, OnInit, OnChanges,EventEmitter, Output, Input,
  Inject, NgZone, SimpleChanges
} from '@angular/core';
import {ModalDirective} from "ng2-bootstrap";
import {MspImage, MspImageError} from '../../model/msp-image';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

let loadImage = require('blueimp-load-image');

var sha1 = require('sha1');

require('./file-uploader.component.less');
@Component({
  selector: 'msp-file-uploader',
  templateUrl: './file-uploader.html'
})
export class FileUploaderComponent implements OnInit, OnChanges {
  lang = require('./i18n');
  errorStyle:boolean;

  @ViewChild('dropZone') dropZone: ElementRef;
  @ViewChild('browseFileRef') browseFileRef: ElementRef;
  @ViewChild('captureFileRef') captureFileRef: ElementRef;
  @ViewChild('imagePlaceholderRef') imagePlaceholderRef: ElementRef;
  @ViewChild('staticModal') staticModalRef: ModalDirective;

  @Input() images: Array<MspImage>;
  @Input() id: string;

  @Output() onAddDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();
  @Output() onErrorDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();
  @Output() onDeleteDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();

  constructor(@Inject('appConstants') private appConstants: any,
              private zone:NgZone) {
  }

  /**
   * A special method to force the rendering of this component.  This is a workaround
   * because for some unknown reason, AngularJS2 change detector does not detect the
   * change of the images Array.
   */
  forceRender() {
    this.zone.run(() => {});
  }

  ngOnChanges(changes: SimpleChanges):void {
    if(changes['images'].currentValue.length === 0 && 
      changes['images'].previousValue.length > 0){
        this.errorStyle = true;
    }else{
        this.errorStyle = false;
    }
  }

  ngOnInit(): void {
    // console.log('subscribe to drop event.');
    let dragOverStream =
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

    let dropStream = Observable.fromEvent<DragEvent>(this.dropZone.nativeElement, "drop");

    let filesArrayFromDrop = dropStream.map(
      function (event) {
        event.preventDefault();
        return event.dataTransfer.files;
      }
    );

    let imagePlaceholderStream = Observable.fromEvent<Event>(this.imagePlaceholderRef.nativeElement, 'click')
      .map((event)=>{
        event.preventDefault();
      });
    imagePlaceholderStream.subscribe((event)=>{
      this.browseFileRef.nativeElement.click();
    });


    let browseFileStream = Observable.fromEvent<Event>(this.browseFileRef.nativeElement, 'change');
    let captureFileStream = Observable.fromEvent<Event>(this.captureFileRef.nativeElement, 'change');

    let filesArrayFromInput = browseFileStream.merge(captureFileStream)
      .map(
        (event) => {
          event.preventDefault();
          return event.target['files'];
        }
      ).merge(filesArrayFromDrop)
      .filter(files => {
        return !!files && files.length && files.length > 0;
      }).flatMap(
        (fileList: FileList) => {
          return this.observableFromFile(fileList[0]);
        }
      )
      .filter(
        (mspImage: MspImage) => {
          let imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
          if (imageExists) this.handleError(MspImageError.AlreadyExists, mspImage);
          return !imageExists;
        }
      ).filter(
        (mspImage: MspImage) => {
          let imageSizeOk = this.checkImageSizeProperties(mspImage);
          if (!imageSizeOk) this.handleError(MspImageError.TooSmall, mspImage);
          return imageSizeOk;
        }
      )
      .subscribe(
        (file: MspImage) => {
          this.handleImageFile(file);
        },

        (error) => {
          console.log(error);
        }
      )

  }

  observableFromFile(file: File) {
    // Init
    let self = this;

    // Create our observer
    let fileObservable = Observable.create((observer: any) => {

      let reader: FileReader = new FileReader();
      let mspImage: MspImage = new MspImage();

      // Copy file properties
      mspImage.name = file.name;

      // Canvas will force the change to a JPEG
      mspImage.contentType = self.appConstants.images.convertToMimeType;

      // First scale the image by loading into a canvas
      let scaledImage = loadImage(
        file,
        function (canvas: HTMLCanvasElement) {

          // Canvas may be an Event when errors happens
          if (canvas instanceof Event) {
            self.handleError(MspImageError.WrongType, mspImage);
            return;
          }

          // While it's still in a canvas, get it's height and width
          mspImage.naturalWidth = canvas.width;
          mspImage.naturalHeight = canvas.height;

          console.log(`image file natural height and width: 
            ${mspImage.naturalHeight} x ${mspImage.naturalWidth}`);

          // Convert to grayscale
          //self.makeGrayScale(canvas);

          // Convert to blob to get size
          canvas.toBlob((blob: Blob) => {

              // Copy the blob properties
              mspImage.size = blob.size;

              let nBytes = mspImage.size;
              let fileSize = '';
              let fileSizeUnit = '';
              let sOutput: string = nBytes + " bytes";
              // optional code for multiples approximation
              for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
                sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
                fileSize = nApprox.toFixed(0);
                fileSizeUnit = aMultiples[nMultiple];
              }

              console.log(`Size of file ${name}: ${sOutput}`);
              mspImage.sizeTxt = sOutput;

              // call reader with new transformed image
              reader.onload = function (evt: any) {

                mspImage.fileContent = evt.target.result;
                mspImage.id = sha1(mspImage.fileContent);

                observer.next(mspImage);
              };
              reader.readAsDataURL(blob);

            },

            // What mime type to make the blob as and jpeg quality
            self.appConstants.images.convertToMimeType, self.appConstants.images.jpegQuality);
        },
        {
          maxWidth: self.appConstants.images.maxWidth,
          maxHeight: self.appConstants.images.maxHeight,
          contain: true,
          canvas: true
        }
      );
    });

    return fileObservable;
  }

  /**
   * Non reversible image filter to take an existing canvas and make it gray scale
   * @param canvas
   */
  makeGrayScale(canvas: HTMLCanvasElement): void {
    let context = canvas.getContext('2d');

    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      // red
      data[i] = brightness;
      // green
      data[i + 1] = brightness;
      // blue
      data[i + 2] = brightness;
    }

    // overwrite original image
    context.putImageData(imageData, 0, 0);
  }


  handleImageFile(mspImage: MspImage) {
    if (this.images.length >= this.appConstants.images.maxImagesPerPerson) {
      console.log(`Max number of image file you can upload is ${this.appConstants.images.maxImagesPerPerson}. 
      This file ${mspImage.name} was not uploaded.`);
    } else {
      this.onAddDocument.emit(mspImage);
    }
  }

  handleError(error:MspImageError, mspImage: MspImage) {
    // just add the error to mspImage
    mspImage.error = error;
    console.log("error with image: ", mspImage);
    this.onErrorDocument.emit(mspImage);
  }

  deleteImage(mspImage: MspImage) {
    // this.staticModalRef.show();
    this.onDeleteDocument.emit(mspImage);
  }

  /**
   * Return true if file already exists in the list; false otherwise.
   */
  static checkImageExists(file: MspImage, imageList: Array<MspImage>) {
    if (!imageList || imageList.length < 1) {
      return false;
    } else {

      let sha1Sum = sha1(file.fileContent);
      for (let i = imageList.length - 1; i >= 0; i--) {
        // console.log(`compare  ${imageList[i].id} with ${sha1Sum}, result ${imageList[i].id === sha1Sum}`);
        if (imageList[i].id === sha1Sum) {
          console.log(`This file ${file.name} has already been uploaded.`);
          return true;
        }
      }
      return false;
    }
  }

  /**
   * Return true if the image size is within range
   * @param file
   */
  checkImageSizeProperties(file: MspImage): boolean {
    if (file.naturalHeight <  this.appConstants.images.minHeight ||
      file.naturalWidth < this.appConstants.images.minWidth) {
      return false;
    }

    return true;
  }

}