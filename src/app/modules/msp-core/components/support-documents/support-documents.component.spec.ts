import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { CommonImage } from 'moh-common-lib';
import { MspLogService } from '../../../../services/log.service';
import { FormsModule, NgForm } from '@angular/forms';
import { SupportDocumentsComponent } from './support-documents.component';
import { SupportDocuments } from '../../models/support-documents.model';

describe('SupportDocumentsComponent', () => {
  let component: SupportDocumentsComponent;
  let fixture: ComponentFixture<SupportDocumentsComponent>;

  beforeEach(() => {
    const mspLogServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SupportDocumentsComponent],
      providers: [{ provide: MspLogService, useFactory: mspLogServiceStub }, NgForm]
    });
    fixture = TestBed.createComponent(SupportDocumentsComponent);
    component = fixture.componentInstance;
    component.supportDoc = new SupportDocuments();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleImagesChange', () => {
    const img1 = new CommonImage();
    img1.size = 20000;
    const img2 = new CommonImage();
    img2.size = 30000;
    const img3 = new CommonImage();
    img3.size = 600000;
    const img4 = new CommonImage();
    img4.size = 10500000;
    const img5 = new CommonImage();
    img5.size = 19999;

    const mockImg: CommonImage[] = [img1];
    const mockImgs: CommonImage[] = [img1, img2];
    const mockImgTooLarge: CommonImage[] = [img4];
    const mockImgsTooLarge: CommonImage[] = [img3, img3];
    const mockImgTooSmall: CommonImage[] = [img5];

    it('sets no error when an image of the appropriate size is uploaded', () => {
      component.handleImagesChange(mockImg);
      expect(component.supportDocErrorMsg).toBe('');
    });
    
    it('sets no error when images collectively of the appropriate size are uploaded', () => {
      component.handleImagesChange(mockImgs);
      expect(component.supportDocErrorMsg).toBe('');
    });
    
    it('sets an error when an image too large is uploaded', () => {
      component.handleImagesChange(mockImgTooLarge);
      expect(component.supportDocErrorMsg).toBe('The addition of the previous document exceeded the maximum upload size of this supporting document section.');
    });

    it('sets an error when image collectively too large are uplaoded', () => {
      component.handleImagesChange(mockImgsTooLarge);
      expect(component.supportDocErrorMsg).toBe('The addition of the previous document exceeded the maximum upload size of this supporting document section.');
    });

    it('sets an error when images are too small', () => {
      component.handleImagesChange(mockImgTooSmall);
      expect(component.supportDocErrorMsg).toBe('The document you attempted to upload is too small. Please try again with a larger, higher quality file.');
    });
  });
});
