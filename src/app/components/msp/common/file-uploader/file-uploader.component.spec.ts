import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FileUploaderComponent } from './file-uploader.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {ThumbnailComponent} from '../thumbnail/thumbnail.component';
import {ModalModule} from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import {MspLogService} from '../../../../services/log.service';
import {LogEntry} from '../logging/log-entry.model';
import * as moment from 'moment';
import {HttpClientModule} from '@angular/common/http';



describe('FileUploaderComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploaderComponent, ThumbnailComponent],
      imports: [FormsModule, ModalModule.forRoot(), RouterTestingModule , HttpClientModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspLogService,


      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(FileUploaderComponent);
    expect(fixture.componentInstance instanceof FileUploaderComponent).toBe(true, 'should create FileUploaderComponent');

  });
});
