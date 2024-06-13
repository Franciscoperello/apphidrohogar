import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://apihydrohogar-e4b85f28b833.herokuapp.com/orders/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  }

  getOrdersByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
