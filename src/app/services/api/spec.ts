import { TestBed, inject } from '@angular/core/testing';
import {Api} from './index';

describe('Api Service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Api]
    });
  });

  it('should ...', inject([Api], (api:Api) => {
    expect(api.title).toBe('Angular 2');
  }));

});
