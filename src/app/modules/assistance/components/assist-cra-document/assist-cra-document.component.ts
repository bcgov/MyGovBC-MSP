import { Component, Input } from '@angular/core';
import { CommonImage, CommonImageError } from 'moh-common-lib';
import { FileUploaderMsg } from 'moh-common-lib/lib/components/file-uploader/file-uploader.component';
import { AssistanceYear } from '../../models/assistance-year.model';

@Component({
  selector: 'assist-cra-document',
  templateUrl: './assist-cra-document.component.html',
  styleUrls: ['./assist-cra-document.component.scss']
})
export class AssistCraDocumentComponent {
  @Input() year: AssistanceYear;
  @Input() isSpouse: boolean = false;

  constructor() { }

  tip = `If you are uploading a copy of a Notice of Assessment or Reassessment from the Canada Revenue Agency website, make sure the image contains:`;
  tipList = ['your name', 'the tax year', 'your net income (line 23600)'];

  // Due to the limitations of the file uploader component, this error message only handles missing files
  get errorMessage(): FileUploaderMsg {
    return { required: 'Files are required for ' + this.year.year }
  };

  get files(): CommonImage[] {
    if (this.year) {
      return this.isSpouse ? this.year.spouseFiles : this.year.files;
    } else {
      return [];
    }
  };
  
  set files(input: CommonImage[]) {
    if (this.year) {
      this.year.files = input;
    }
  }

  validFiles() {
    if (this.year) {
      return this.isSpouse ? this.year.spouseFiles.length < 1 : this.year.files.length < 1;
    } else {
      return false;
    }
  }

  // Check the collective size, triggered whenever an image is added or removed
  handleImagesChange(imgs: Array<CommonImage>) {
    // Set newly uploaded files
    this.isSpouse ? this.year.spouseFiles = imgs : this.year.files = imgs;
    let sum = 0;
    let tooSmall = false;

    imgs.forEach(img => { 
      if (typeof img.size === 'number') {
        sum += img.size;
      }

      if (img.size < 20000) {
        this.isSpouse ? this.year.spouseFiles.pop() : this.year.files.pop();
        tooSmall = true;
      }
    });
    
    // Same limit as moh-common-lib
    if (sum > 1048576) {
      // Reset the attachments for this upload
      this.isSpouse ? this.year.spouseFiles = [] : this.year.files = [];
      this.year.fileError = 'The addition of the previous document exceeded the maximum upload size of this supporting document section.';
    } else if (tooSmall) {
      this.year.fileError = 'The document you attempted to upload is too small. Please try again with a larger, higher quality file.';
    } else {
      this.year.fileError = '';
    }
  }

  // Set the error obj and appropriate msg, triggered when component has an error
  handleSupportDocError(error: CommonImage) {
    if (error) {
      switch (error.error) {
        case CommonImageError.WrongType:
          this.year.fileError = 'That is the wrong type of attachment to submit.';
          break;
        case CommonImageError.TooSmall:
          this.year.fileError = 'That attachment is too small, please upload a larger attachment.';
          break;
        case CommonImageError.TooBig:
          this.year.fileError = 'That attachment is too big, please upload a smaller attachment.';
          break;
        case CommonImageError.AlreadyExists:
          this.year.fileError = 'That attachment has already been uploaded.';
          break;
        case CommonImageError.Unknown:
          this.year.fileError = 'The upload failed, please try again. If the issue persists, please upload a different attachment.';
          break;
        case CommonImageError.CannotOpen:
          this.year.fileError = 'That attachment cannot be opened, please upload a different attachment.';
          break;
        case CommonImageError.PDFnotSupported:
          this.year.fileError = 'That PDF type is not supported, please upload a different attachment.';
          break;
        case CommonImageError.CannotOpenPDF:
          this.year.fileError = 'That PDF cannot be opened, please upload a different attachment.';
          break;
        default:
          break;
      }
    }
  }
}
