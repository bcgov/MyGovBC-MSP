import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { FileUploaderComponent } from './file-uploader.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {ThumbnailComponent} from "../thumbnail/thumbnail.component";
import {ModalModule} from "ng2-bootstrap";
import appConstants from '../../../../services/appConstants';

describe('FileUploaderComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploaderComponent, ThumbnailComponent],
      imports: [FormsModule, ModalModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(FileUploaderComponent);
    expect(fixture.componentInstance instanceof FileUploaderComponent).toBe(true, 'should create FileUploaderComponent');

  });
})
