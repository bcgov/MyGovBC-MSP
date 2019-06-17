import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistContainerComponent } from './assist-container.component';

describe('AssistContainerComponent', () => {
  let component: AssistContainerComponent;
  let fixture: ComponentFixture<AssistContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
