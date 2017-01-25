import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { AssistanceAuthorizeSubmitComponent } from './authorize-submit.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {MspCancelComponent} from "../../common/cancel/cancel.component";

describe('AssistanceAuthorizeSubmitComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceAuthorizeSubmitComponent, FileUploaderComponent, ThumbnailComponent, MspCancelComponent],
      imports: [FormsModule, Ng2BootstrapModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceAuthorizeSubmitComponent);
    expect(fixture.componentInstance instanceof AssistanceAuthorizeSubmitComponent).toBe(true, 'should create AssistanceAuthorizeSubmitComponent');

  });
})
