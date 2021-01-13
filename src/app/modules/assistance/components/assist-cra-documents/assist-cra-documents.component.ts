import { Component, Input } from '@angular/core';
import { CommonImage, CommonImageError } from 'moh-common-lib';
import { FileUploaderMsg } from 'moh-common-lib/lib/components/file-uploader/file-uploader.component';
import { AssistanceYear } from '../../models/assistance-year.model';

@Component({
  selector: 'assist-cra-documents',
  templateUrl: './assist-cra-documents.component.html',
  styleUrls: ['./assist-cra-documents.component.scss']
})
export class AssistCraDocumentsComponent {
  @Input() selectedYears: AssistanceYear[];
  @Input() isSpouse: boolean = false;

  constructor() { }

  tip = `If you are uploading a copy of a Notice of Assessment or Reassessment from the Canada Revenue Agency website, make sure the image contains:`;
  tipList = ['your name', 'the tax year', 'your net income (line 23600)'];

  // Due to the limitations of the file uploader component, this error message only handles missing files
  errorMessage(year: AssistanceYear): FileUploaderMsg {
    return { required: 'Files are required for ' + year.year }
  };

  files(year: AssistanceYear): CommonImage[] {
    if (year) {
      return this.isSpouse ? year.spouseFiles : year.files;
    } else {
      return [];
    }
  };

  validFiles(year: AssistanceYear): boolean {
    if (year) {
      return this.isSpouse ? year.spouseFiles.length < 1 : year.files.length < 1;
    } else {
      return false;
    }
  }

  // Check the collective size, triggered whenever an image is added or removed
  handleImagesChange(imgs: Array<CommonImage>, year: AssistanceYear) {
    // Set newly uploaded files
    this.isSpouse ? year.spouseFiles = imgs : year.files = imgs;
    let sum = 0;
    let tooSmall = false;

    imgs.forEach(img => { 
      if (typeof img.size === 'number') {
        sum += img.size;
      }

      if (img.size < 20000) {
        this.isSpouse ? year.spouseFiles.pop() : year.files.pop();
        tooSmall = true;
      }
    });
    
    // Same limit as moh-common-lib
    if (sum > 1048576) {
      // Reset the attachments for this upload
      this.isSpouse ? year.spouseFiles = [] : year.files = [];
      year.fileError = 'The addition of the previous document exceeded the maximum upload size of this supporting document section.';
    } else if (tooSmall) {
      year.fileError = 'The document you attempted to upload is too small. Please try again with a larger, higher quality file.';
    } else {
      year.fileError = '';
    }
  }

  // Set the error obj and appropriate msg, triggered when component has an error
  handleSupportDocError(error: CommonImage, year: AssistanceYear) {
    if (error) {
      switch (error.error) {
        case CommonImageError.WrongType:
          year.fileError = 'That is the wrong type of attachment to submit.';
          break;
        case CommonImageError.TooSmall:
          year.fileError = 'That attachment is too small, please upload a larger attachment.';
          break;
        case CommonImageError.TooBig:
          year.fileError = 'That attachment is too big, please upload a smaller attachment.';
          break;
        case CommonImageError.AlreadyExists:
          year.fileError = 'That attachment has already been uploaded.';
          break;
        case CommonImageError.Unknown:
          year.fileError = 'The upload failed, please try again. If the issue persists, please upload a different attachment.';
          break;
        case CommonImageError.CannotOpen:
          year.fileError = 'That attachment cannot be opened, please upload a different attachment.';
          break;
        case CommonImageError.PDFnotSupported:
          year.fileError = 'That PDF type is not supported, please upload a different attachment.';
          break;
        case CommonImageError.CannotOpenPDF:
          year.fileError = 'That PDF cannot be opened, please upload a different attachment.';
          break;
        default:
          break;
      }
    }
  }
}
