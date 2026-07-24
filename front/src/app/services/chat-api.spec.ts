import { TestBed } from '@angular/core/testing';
import { ChatAPI } from './chat-api';

describe('ChatAPI', () => {
  let service: ChatAPI;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatAPI);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
