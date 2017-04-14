import { TestBed, inject } from '@angular/core/testing';

import { ChatroomService } from './chatroom.service';

describe('ChatroomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatroomService]
    });
  });

  it('should ...', inject([ChatroomService], (service: ChatroomService) => {
    expect(service).toBeTruthy();
  }));
});
