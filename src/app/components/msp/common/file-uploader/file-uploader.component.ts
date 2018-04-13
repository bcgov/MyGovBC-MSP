import {
    Component, ViewChild, ElementRef, OnInit, OnChanges, EventEmitter, Output, Input,
    Inject, NgZone, SimpleChanges, ChangeDetectorRef, ContentChild, AfterContentInit
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ModalDirective} from "ngx-bootstrap";
import {
    MspImage, MspImageError, MspImageProcessingError,
    MspImageScaleFactors, MspImageScaleFactorsImpl
} from '../../model/msp-image';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {BaseComponent} from "../base.component";
import {MspLogService} from "../../service/log.service";
import {MspDataService} from "../../service/msp-data.service";
import {LogEntry} from "../logging/log-entry.model";
import * as moment from 'moment';
import {PDFJSStatic} from 'pdfjs-dist';

import {environment} from '../../../../../environments/environment';

let loadImage = require('blueimp-load-image');


var sha1 = require('sha1');
const PDFJS: PDFJSStatic = require('pdfjs-dist');

@Component({
    selector: 'msp-file-uploader',
    templateUrl: './file-uploader.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent
    extends BaseComponent
    implements OnInit, OnChanges, AfterContentInit {
    lang = require('./i18n');
    noIdImage: Boolean = false;
    private appConstants;
    @ViewChild('formRef') form: NgForm;
    @ViewChild('dropZone') dropZone: ElementRef;
    @ViewChild('browseFileRef') browseFileRef: ElementRef;
    @ViewChild('captureFileRef') captureFileRef: ElementRef;
    @ViewChild('imagePlaceholderRef') imagePlaceholderRef: ElementRef;
    @ViewChild('selectFileLabel') selectFileLabelRef: ElementRef;
    @ViewChild('staticModal') staticModalRef: ModalDirective;

    @ContentChild('uploadInstruction') uploadInstructionRef: ElementRef;
    @Input() images: Array<MspImage>;
    @Input() id: string;
    @Input() showError: boolean;
    @Input() required: boolean = false;

    @ViewChild('canvas') canvas: ElementRef;


    @Output() onAddDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();
    @Output() onErrorDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();
    @Output() onDeleteDocument: EventEmitter<MspImage> = new EventEmitter<MspImage>();

    constructor(private dataService: MspDataService,
                private logService: MspLogService,
                private zone: NgZone,
                private cd: ChangeDetectorRef) {
        super(cd);
        this.appConstants = environment.appConstants;
    }

    /**
     * A special method to force the rendering of this component.  This is a workaround
     * because for some unknown reason, AngularJS2 change detector does not detect the
     * change of the images Array.
     */
    forceRender() {
        this.zone.run(() => {
        });
    }


    ngOnChanges(changes: SimpleChanges): void {
        console.log('fileuploader onChanges', changes['images']);
        // if (changes['images'] && (changes['images'].currentValue.length === 0 &&
        //   changes['images'].previousValue.length > 0)) {
        if (changes['images'] && (
                changes['images'].currentValue.length === 0
                && changes['images'].previousValue
                && changes['images'].previousValue.length > 0)
        ) {
            this.noIdImage = true;
        } else {
            this.noIdImage = false;
        }
    }

    /*
     System processing steps

     1. User clicks browse or drag-n-drops an file
     2. For browse case, the browser is told to only accept mime type image/*, .JPG, .GIF, .PNG, etc, however user can override and for drag-n-drop we don't can't impose this filter
     4. Using the HTML5 File API, we open a handle on the file
     5. Read the filename for later display to the user
     6. Create a hidden Image element in the browser's DOM
     7. Read the file's bytes as a DataUrl and copy them into the Image element
     8. Wait until the Image finishes loading the image
     9. Read the image element's natural width and height
     10. Pass the File handle into a HTML5 Canvas lib (we need the XIFF headers to auto rotate, XIFF headers are not available in DataUrl)
     11. The Canvas errors because it's a wrong type, e.g., TIFF, we abort and notify user
     12. Instruct the Canvas lib to keep resizing the image if it exceeds a maximum width or height, extract meta data, and auto-orient based on XIFF metadata.  It uses a "contain" operation which retains it's width to height pixel ratio.
     13. Call a function on the Canvas element to turn the Canvas into a JPEG of quality 50%.
     14. Once in a Blob with get the blob size in bytes and a human friendly display size
     15. In order to more easily manage the image, we convert the Blob to a DataUrl again.
     16. Pass the DataUrl into a hash algorithm to create an identifier and to check if the image has already been uploaded
     17. Next we check the final size of the image to ensure it's not to small in resolution (arguably this could've been done earlier), if too small we notify user
     18. Finally, the image is saved into the user's ongoing EA/PA application including localstorage
     19. The image is displayed to user as a thumbnail

     */

    ngOnInit(): void {


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

        let browseFileStream = Observable.fromEvent<Event>(this.browseFileRef.nativeElement, 'change');
        let captureFileStream = Observable.fromEvent<Event>(this.captureFileRef.nativeElement, 'change');
        // let brosweFileInputElement = this.browseFileRef.nativeElement;
        // let captureFileInputElement = this.captureFileRef.nativeElement;
        let pdfFileList = new Array<Observable<File>>();

        // obtain the PDF observables
        /* let filesArrayFromInput = browseFileStream.merge(captureFileStream)
            .map((event) => {
                  event.preventDefault();
                  return event.target['files'];
                }
            ).merge(filesArrayFromDrop).filter(files => {
                  return !!files && files.length && files.length > 0;
                }
            ).flatMap((fileList: FileList) => {
                  console.info("getting files");
                  for (var i = 0; i < fileList.length; i++) {
                    console.info("loading " + i + " image of " + fileList.length + " file: " + fileList[i]);
                    // if (fileList[i].type == "application/pdf") {
                        console.info("  --> pdf file");
                        pdfFileList.push(this.observableFromFile(fileList[i], new MspImageScaleFactorsImpl(1, 1)));
                    // }
                  }
                  return pdfFileList;
                }
            // ).flatMap((fileIn: Observable<File>) => {
            //    console.info("getting files again");
            //    return this.observableFromFile(fileIn, new MspImageScaleFactorsImpl(1, 1));
            //    }
            */
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
                    return this.observableFromFiles(fileList, new MspImageScaleFactorsImpl(1, 1));
                }
            )
            .filter(
                (mspImage: MspImage) => {
                    let imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
                    if (imageExists) {
                        this.handleError(MspImageError.AlreadyExists, mspImage);
                        this.resetInputFields();
                    }
                    return !imageExists;
                }
            ).filter((mspImage: MspImage) => {
                    let imageExists = FileUploaderComponent.checkImageExists(mspImage, this.images);
                    if (imageExists) {
                        this.handleError(MspImageError.AlreadyExists, mspImage);
                        this.resetInputFields();
                    }
                    return !imageExists;
                }
            ).filter((mspImage: MspImage) => {
                    let imageSizeOk = this.checkImageDimensions(mspImage);
                    if (!imageSizeOk) {
                        this.handleError(MspImageError.TooSmall, mspImage);
                        this.resetInputFields();
                    }
                    return imageSizeOk;
                }
            ).subscribe(
                (file: MspImage) => {
                    this.handleImageFile(file);
                    this.resetInputFields();
                    this.emitIsFormValid(true);
                },

                (error) => {
                    console.log('Error in loading image: %o', error);

                    /**
                     * Handle the error if the image is gigantic that after
                     * 100 times of scaling down by 30% on each step, the image
                     * is still over 1 MB.
                     */
                    if (error.errorCode) {
                        if (MspImageError.TooBig === error.errorCode) {
                            this.handleError(MspImageError.TooBig, error.image);
                        } else if (MspImageError.CannotOpen === error.errorCode) {
                            if (!error.image) {
                                error.image = new MspImage();
                                if (error.rawImageFile)
                                    error.image.name = error.rawImageFile.name;
                            }
                            this.handleError(MspImageError.CannotOpen, error.image);
                        } else {
                            throw error;
                        }
                    }

                    this.emitIsFormValid();

                },
                () => {
                    console.log('completed loading image');
                }
            )

    }

    ngAfterContentInit() {
        let imagePlaceholderEnterKeyStream = Observable.fromEvent<Event>(this.imagePlaceholderRef.nativeElement, 'keyup')
            .merge(
                Observable.fromEvent<Event>(this.selectFileLabelRef.nativeElement, 'keyup')
            )
            .merge(
                Observable.fromEvent<Event>(this.uploadInstructionRef.nativeElement, 'keyup')
            )
            .filter((evt: KeyboardEvent) => {
                return evt.key === 'Enter';
            });

        Observable.fromEvent<Event>(this.imagePlaceholderRef.nativeElement, 'click')
            .merge(
                Observable.fromEvent<Event>(this.uploadInstructionRef.nativeElement, 'click')
            )
            .merge(imagePlaceholderEnterKeyStream)
            .map((event) => {
                event.preventDefault();
                return event;
            }).subscribe(
            (event) => {
                this.browseFileRef.nativeElement.click();
            }
        );
    }

    /**
     * Solve size in this equation: size * 0.8to-the-power-of30 < 1MB, size
     * will be the max image size this application can accept and scale down
     * to under 1MB. In this case: size < 807 MB
     *
     * 30 is the number of retries. the value for maxRetry passed to retryStrategy
     * function.
     *
     * If: size * 0.8to-the-power-of40 < 1MB, then size < 1262 MB.
     *
     * Note: 0.8 is the self.appConstants.images.reductionScaleFactor defined in global.js
     *
     *
     * @param file
     * @param scaleFactors
     */
    observableFromFiles(fileList: FileList, scaleFactors: MspImageScaleFactors) {


        // Init
        let self = this;

        // Create our observer
        let fileObservable = Observable.create((observer: Observer<MspImage>) => {

            let mspImages = [];
            for (var fileIndex = 0; fileIndex < fileList.length; fileIndex++) {

                var file = fileList[fileIndex];
                console.log('Start processing file ' + fileIndex + ' of ' + fileList.length + ' %s of size %s bytes %s type', file.name, file.size, file.type);

                scaleFactors = scaleFactors.scaleDown(self.appConstants.images.reductionScaleFactor);

                // let mspImage: MspImage = new MspImage();
                // let reader: FileReader = new FileReader();

                // // Copy file properties
                // mspImage.name = file.name;
                if (file.type == "application/pdf") {
                    this.readPDF(file, (images: HTMLImageElement[]) => {
                        images.map((image, index) => {
                            let mspImage: MspImage = new MspImage();
                            let reader: FileReader = new FileReader();
                            // Copy file properties
                            mspImage.name = file.name + "-page" + index;
                            //Temporary so we don't have duplicate file names. TODO: Improve.
                            //   mspImage.name += Math.ceil(Math.random()*100);

                            this.resizeImage(mspImage, image, self, file, scaleFactors, reader, observer);
                        })
                    }, (error) => {
                        console.log("----" + error);
                        let imageReadError: MspImageProcessingError =
                            new MspImageProcessingError(MspImageError.CannotOpen);
                        observer.error(imageReadError);
                    });
                } else {
                    let mspImage: MspImage = new MspImage();
                    let reader: FileReader = new FileReader();

                    // Copy file properties
                    mspImage.name = file.name;

                    // Load image into img element to read natural height and width
                    this.readImage(file, (image: HTMLImageElement) => {
                            this.resizeImage(mspImage, image, self, file, scaleFactors, reader, observer);
                        },

                        //can be ignored for bug, the log line is never called
                        (error: MspImageProcessingError) => {
                            observer.error(error);
                        });
                }
            }

            //retryWhen is potential issue!
        }).retryWhen(this.retryStrategy(32));
        return fileObservable;
    }


    private resizeImage(mspImage: MspImage, image: HTMLImageElement, self: this, file: File, scaleFactors: MspImageScaleFactors, reader: FileReader, observer: Observer<MspImage>) {
// While it's still in an image, get it's height and width
        mspImage.naturalWidth = image.naturalWidth;
        mspImage.naturalHeight = image.naturalHeight;

        console.log(`image file natural height and width: 
            ${mspImage.naturalHeight} x ${mspImage.naturalWidth}`);

        // Canvas will force the change to a JPEG
        mspImage.contentType = self.appConstants.images.convertToMimeType;

        // Scale the image by loading into a canvas

        console.log('Start scaling down the image using blueimp-load-image lib: ');
        let scaledImage = loadImage(
            image.src, // NOTE: we pass the File ref here again even though its already read because we need the XIFF metadata
            function (canvas: HTMLCanvasElement, metadata: any) {

                // Canvas may be an Event when errors happens
                if (canvas instanceof Event) {
                    self.handleError(MspImageError.WrongType, mspImage);
                    self.resetInputFields();
                    return;
                }
                // Convert to blob to get size
                canvas.toBlob((blob: Blob) => {
                        // Copy the blob properties
                        mspImage.size = blob.size;

                        // log image info (but only for the first time before any scaling)
                        if (scaleFactors.widthFactor == self.appConstants.images.reductionScaleFactor)
                            self.logImageInfo("msp_file-uploader_before_resize_attributes", self.dataService.getMspUuid(), mspImage, "  mspImagefileName: " + file.name);

                        let fileName = mspImage.name;
                        let nBytes = mspImage.size;
                        let fileSize = '';
                        let fileSizeUnit = '';
                        let sOutput: string = nBytes + " bytes";
                        // optional code for multiples approximation
                        for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
                                 nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {

                            sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
                            fileSize = nApprox.toFixed(0);
                            fileSizeUnit = aMultiples[nMultiple];
                            mspImage.sizeUnit = fileSizeUnit;
                        }

                        console.log(`File ${fileName} is scaled down to: ${sOutput}`);
                        mspImage.sizeTxt = sOutput;

                        // call reader with new transformed image
                        reader.onload = function (evt: any) {

                            mspImage.fileContent = evt.target.result;
                            mspImage.id = sha1(mspImage.fileContent);

                            // keep scaling down the image until the image size is
                            // under max image size

                            if (mspImage.size > self.appConstants.images.maxSizeBytes) {

                                console.log('File size after scaling down: %d, max file size allowed: %d',
                                    mspImage.size, self.appConstants.images.maxSizeBytes);

                                let imageTooBigError: MspImageProcessingError =
                                    new MspImageProcessingError(MspImageError.TooBig);

                                imageTooBigError.maxSizeAllowed = self.appConstants.images.maxSizeBytes;
                                imageTooBigError.mspImage = mspImage;

                                observer.error(imageTooBigError);
                            }
                            else {
                                // log image info
                                //   self.logImageInfo("msp_file-uploader_after_resize_attributes", self.dataService.getMspUuid(), mspImage);
                                observer.next(mspImage);
                            }
                        };
                        reader.readAsDataURL(blob);
                    },

                    // What mime type to make the blob as and jpeg quality
                    self.appConstants.images.convertToMimeType, self.appConstants.images.jpegQuality);
            },
            {
                maxWidth: self.appConstants.images.maxWidth * scaleFactors.widthFactor,
                maxHeight: self.appConstants.images.maxHeight * scaleFactors.heightFactor,
                contain: true,
                canvas: true,
                meta: true,
                orientation: true
            }
        );
    }

    /**
     * Max retry scaling down for maxRetry times.
     */
    retryStrategy(maxRetry: number) {
        return function (errors: Observable<MspImageProcessingError>) {
            return errors.scan(
                (acc, error, index) => {
                    // console.log('Error encountered: %o', error);;

                    /**
                     * If the error is about file too big and we have not reach max retry
                     * yet, theyt keep going to scaling down.
                     */
                    if (acc < maxRetry && error.errorCode === MspImageError.TooBig) {
                        // console.log('Progressively scaling down the image, step %d.', index);
                        return acc + 1;
                    } else {
                        /**
                         * For either conditions terminate the retry, propogate
                         * the error.
                         *
                         * 1. errors such as CannotRead or any other unknown errors
                         * not listed in MspImageError enum
                         * 2. Exceeded maxRetry
                         *
                         */
                        console.log('Re-throw this image process error: %o', error);
                        throw error;
                    }
                }, 0
            ).delay(2);
        }
    };

    private readImage(imageFile: File,
                      callback: (image: HTMLImageElement) => void,
                      invalidImageHanlder: (error: MspImageProcessingError) => void) {
        let reader = new FileReader();

        reader.onload = function (progressEvt: ProgressEvent) {

            console.log('loading image into an img tag: %o', progressEvt);
            // Load into an image element
            let imgEl: HTMLImageElement = document.createElement('img');
            imgEl.src = reader.result;

            // Wait for onload so all properties are populated
            imgEl.onload = (args) => {
                console.log('Completed image loading into an img tag: %o', args);
                return callback(imgEl);
            };

            imgEl.onerror =
                (args) => {

                    // log it to the console
                    console.log('This image cannot be opened/read, it is probably an invalid image. %o', args);

                    // throw new Error('This image cannot be opened/read');
                    let imageReadError: MspImageProcessingError =
                        new MspImageProcessingError(MspImageError.CannotOpen);

                    imageReadError.rawImageFile = imageFile;

                    return invalidImageHanlder(imageReadError);
                };
        };

        reader.readAsDataURL(imageFile);
    }

    private readPDF(pdfFile: File,
                    callback: (image: HTMLImageElement[]) => void, error: (errorReason: any) => void) {

        PDFJS.disableWorker = true;
        PDFJS.disableStream = true;
        let reader = new FileReader();
        var currentPage = 1;
        var canvas = document.createElement('canvas');
        let imgElsArray: HTMLImageElement[] = [];
        var ctx = canvas.getContext('2d');
        reader.onload = function (progressEvt: ProgressEvent) {

            var docInitParams = {data: reader.result};
            PDFJS.getDocument(docInitParams).then((pdfdoc) => {
                var numPages = pdfdoc.numPages;
                if (currentPage <= pdfdoc.numPages) getPage();

                function getPage() {
                    pdfdoc.getPage(currentPage).then(function (page) {
                        var scale = 1.5;
                        var viewport = page.getViewport(scale);

                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        var renderContext = {
                            canvasContext: ctx,
                            viewport: viewport
                        };

                        page.render(renderContext).then(function () {
                            let imgEl: HTMLImageElement = document.createElement('img');
                            imgEl.src = canvas.toDataURL();
                            imgElsArray.push(imgEl);
                            if (currentPage < numPages) {
                                currentPage++;
                                getPage();
                            } else {
                                callback(imgElsArray);
                            }

                        });
                    }, function (errorReason) {
                        error(errorReason);

                    });
                }
            }, function (errorReason) {
                error(errorReason);
            });

        };
        reader.readAsArrayBuffer(pdfFile);

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
        console.log('image size (bytes) after compression: ' + mspImage.size);
        if (this.images.length >= this.appConstants.images.maxImagesPerPerson) {

            // log it
            this.logImageInfo("msp_file-uploader_error", this.dataService.getMspUuid(),
                mspImage, `Number of image files exceeds max of ${this.appConstants.images.maxImagesPerPerson}`);

            // log to console
            console.log(`Max number of image file you can upload is ${this.appConstants.images.maxImagesPerPerson}. 
      This file ${mspImage.name} was not uploaded.`);
        } else {
            this.onAddDocument.emit(mspImage);
            this.showError = false;
            this.noIdImage = false;
        }
    }

    handleError(error: MspImageError, mspImage: MspImage) {

        if (!mspImage) {
            mspImage = new MspImage();
        }
        // just add the error to mspImage
        mspImage.error = error;

        // log the error
        if (error != MspImageError.PDFnotSupported) {
            this.logImageInfo("msp_file-uploader_error", this.dataService.getMspUuid(), mspImage,
                "  mspImageFile: " + mspImage.name + "  mspErrorNum: " + error + "  mspError: " +
                MspImageError[error]);
        }

        // console.log("error with image: ", mspImage);
        this.onErrorDocument.emit(mspImage);
    }

    /**
     * Reset input fields so that user can delete a file and
     * immediately upload that file again.
     */
    resetInputFields() {
        // let brosweFileInputElement = this.browseFileRef.nativeElement;
        // let captureFileInputElement = this.captureFileRef.nativeElement;
        this.browseFileRef.nativeElement.value = "";
        this.captureFileRef.nativeElement.value = "";
    }

    deleteImage(mspImage: MspImage) {
        // this.staticModalRef.show();
        this.resetInputFields();
        this.onDeleteDocument.emit(mspImage);
    }

    /**
     * Log image attributes
     * @param mspImage
     */
    private logImageInfo(title: string, applicationId: string, mspImage: MspImage, additionalInfo?: string) {

        // create log entry
        let log: LogEntry = new LogEntry();
        log.applicationId = applicationId;
        var now = moment();
        log.mspTimestamp = now.toISOString();
        log.applicationPhase = title + ":  mspImageId: " + mspImage.id
            + "  mspImageUuid: " + mspImage.uuid
            + "  mspImageSize: " + mspImage.size
            + "  mspImageWidth: " + mspImage.naturalWidth
            + "  mspImageHeight: " + mspImage.naturalHeight
            + "  mspImageContentType: " + mspImage.contentType
            + (additionalInfo ? "  " + additionalInfo : "");

        // send it while subscribing to response
        this.logService.logIt(log, title).subscribe(
            (response) => {
                // console.log('log rest service response: ');
                // console.log(response);
            },
            (error) => {
                console.log('HTTP error response from logging service: ');
                console.log(error);
            },
            () => {
                // console.log('log rest service completed!');
            }
        );
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
    checkImageDimensions(file: MspImage): boolean {
        if (file.naturalHeight < this.appConstants.images.minHeight ||
            file.naturalWidth < this.appConstants.images.minWidth) {
            return false;
        }
        return true;
    }

    isValid(): boolean {
        if (this.required) {
            return this.images && this.images.length > 0;
        }
        return true;
    }

}
