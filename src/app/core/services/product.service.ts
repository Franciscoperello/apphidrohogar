import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponseModel, ICategory, IProduct } from '../model/Models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = 'https://apihydrohogar-e4b85f28b833.herokuapp.com/products/';
  apiUrl2: string = 'https://apihydrohogar-e4b85f28b833.herokuapp.com/products/';

  constructor(private http: HttpClient) {}

  getAllProduct(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}GetAllProducts`);
  }

  getAllProductsByCategory(categoria: string) {
    return this.http.get<APIResponseModel>(`${this.apiUrl}GetProductsByCategory/${categoria}`);
  }
  getAllCategory(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl2}GetAllCategories`);
  }
  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}GetProductById/${id}`);
  }

  createProduct(obj: any) {
    return this.http.post(`${this.apiUrl}addProduct`, obj);
  }

  updateProduct(id: number, obj: any) {
    return this.http.put(`${this.apiUrl}UpdateProduct/${id}`, obj);
  }

  uploadImage(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(`${this.apiUrl}upload`, formData);
  }
}
