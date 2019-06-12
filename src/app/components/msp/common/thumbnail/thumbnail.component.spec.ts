import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ThumbnailComponent } from './thumbnail.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {ModalModule} from 'ngx-bootstrap';

describe('ThumbnailComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbnailComponent],
      imports: [FormsModule, ModalModule.forRoot(), LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService,
        LocalStorageService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(ThumbnailComponent);
    expect(fixture.componentInstance instanceof ThumbnailComponent).toBe(true, 'should create ThumbnailComponent');
  });
});
