import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../model/Models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'https://apihydrohogar-e4b85f28b833.herokuapp.com/cart/';

  constructor(private http: HttpClient) { }

  addToCart(userId: number, productId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}addToCart/${userId}/${productId}`, {});
  }

  getCartItemCount(): Observable<number> {
    const userId = JSON.parse(sessionStorage.getItem('userData')!).id;
    return this.http.get<number>(`${this.apiUrl}getTotalProductsInCart/${userId}`);
  }

  getCartByUserId(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}getCartByUserId/${id}`);
  }

  deleteCart() {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    });
    const userId = JSON.parse(sessionStorage.getItem('userData')!).id;
    return this.http.delete(`${this.apiUrl}deleteCartByUserId/${userId}`, { headers, responseType: 'text' });
  }

  increaseProductQuantity(userId: number, productId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}increaseProductQuantity/${userId}/${productId}`, {});
  }

  decreaseProductQuantity(userId: number, productId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}decreaseProductQuantity/${userId}/${productId}`, {});
  }

  removeProductFromCart(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}removeProductFromCart/${userId}/${productId}`, { responseType: 'text' });
  }
}
