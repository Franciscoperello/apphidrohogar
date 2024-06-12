import { TestBed } from '@angular/core/testing';

import { CartItemCountService } from './cart-item-count.service';

describe('CartItemCountService', () => {
  let service: CartItemCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartItemCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
