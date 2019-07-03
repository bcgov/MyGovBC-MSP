import { TestBed, async, inject } from '@angular/core/testing';

import { AssistGuard } from './assist.guard';

describe('AssistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssistGuard]
    });
  });

  it('should ...', inject([AssistGuard], (guard: AssistGuard) => {
    expect(guard).toBeTruthy();
  }));
});
