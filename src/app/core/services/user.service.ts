import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponseModel } from '../model/Models';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  apiUrl: string = 'https://apihydrohogar-e4b85f28b833.herokuapp.com/users/';

  constructor(private http: HttpClient) {}

  loginUser(obj: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.apiUrl}Login`, obj);
  }

  registerUser(obj: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.apiUrl}users`, obj);
  }
}