import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from 'angular-2-local-storage';
import { AclDataService } from './acl-data.service';

describe('AclDataService', () => {
  let service: AclDataService;
  beforeEach(() => {
    const localStorageServiceStub = () => ({
      set: (_storageKey, dto) => ({}),
      get: _storageKey => ({})
    });

    TestBed.configureTestingModule({
      providers: [
        AclDataService,
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });

    service = TestBed.get(AclDataService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('saveApplication', () => {
    it('makes expected call', () => {
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'set').and.callThrough();
      service.saveApplication();
      expect(localStorageServiceStub.set).toHaveBeenCalled();
    });
  });
});
