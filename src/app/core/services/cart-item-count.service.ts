import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartItemCountService {

  private cartItemCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartItemCount$: Observable<number> = this.cartItemCountSubject.asObservable();

  constructor() {}

  updateCartItemCount(count: number): void {
    this.cartItemCountSubject.next(count);
  }
}
