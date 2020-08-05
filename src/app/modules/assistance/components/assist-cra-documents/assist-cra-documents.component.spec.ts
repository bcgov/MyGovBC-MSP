import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { AssistCraDocumentsComponent } from './assist-cra-documents.component';

describe('AssistCraDocumentsComponent', () => {
  let component: AssistCraDocumentsComponent;
  let fixture: ComponentFixture<AssistCraDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistCraDocumentsComponent ],
      imports: [
        SharedCoreModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistCraDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
