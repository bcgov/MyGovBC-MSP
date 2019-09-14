import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDocumentsComponent } from './support-documents.component';

describe('SupportDocumentsComponent', () => {
  let component: SupportDocumentsComponent;
  let fixture: ComponentFixture<SupportDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
