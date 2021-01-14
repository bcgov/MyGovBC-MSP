import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AssistCraDocumentsComponent } from './assist-cra-documents.component';
import { CommonImage } from 'moh-common-lib';
import { AssistanceYear } from '../../models/assistance-year.model';

describe('AssistCraDocumentsComponent', () => {
  let component: AssistCraDocumentsComponent;
  let fixture: ComponentFixture<AssistCraDocumentsComponent>;
  let year;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AssistCraDocumentsComponent]
    });
    fixture = TestBed.createComponent(AssistCraDocumentsComponent);
    component = fixture.componentInstance;
    year = new AssistanceYear();
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
      component.handleImagesChange(mockImg, year);
      expect(year.fileError).toBe('');
    });
    
    it('sets no error when images collectively of the appropriate size are uploaded', () => {
      component.handleImagesChange(mockImgs, year);
      expect(year.fileError).toBe('');
    });
    
    it('sets an error when an image too large is uploaded', () => {
      component.handleImagesChange(mockImgTooLarge, year);
      expect(year.fileError).toBe('The addition of the previous document exceeded the maximum upload size of this supporting document section.');
    });

    it('sets an error when image collectively too large are uplaoded', () => {
      component.handleImagesChange(mockImgsTooLarge, year);
      expect(year.fileError).toBe('The addition of the previous document exceeded the maximum upload size of this supporting document section.');
    });

    it('sets an error when images are too small', () => {
      component.handleImagesChange(mockImgTooSmall, year);
      expect(year.fileError).toBe('The document you attempted to upload is too small. Please try again with a larger, higher quality file.');
    });
  });
});
