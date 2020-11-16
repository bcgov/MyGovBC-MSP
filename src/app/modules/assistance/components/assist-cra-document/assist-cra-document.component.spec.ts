import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CraDocumentComponent } from './assist-cra-document.component';

describe('CraDocumentComponent', () => {
  let component: CraDocumentComponent;
  let fixture: ComponentFixture<CraDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CraDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CraDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
