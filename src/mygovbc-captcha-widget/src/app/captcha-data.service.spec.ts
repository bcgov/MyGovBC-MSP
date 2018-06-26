import { TestBed, inject } from '@angular/core/testing';
import { Http, Response } from '@angular/http';
import{HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { CaptchaDataService } from './captcha-data.service';

describe('CaptchaDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaptchaDataService],

      imports: [
        HttpClientModule,
        FormsModule
      ]

    });
  });

  it('should be created', inject([CaptchaDataService], (service: CaptchaDataService) => {
    expect(service).toBeTruthy();
  }));
});
