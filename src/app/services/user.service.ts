import { Injectable } from '@angular/core';
import { User } from '../models/entites/user';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel/responseModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl='https://localhost:44327/api/Users/';
  
  constructor(private httpClient:HttpClient) { }

  updateProfile(user: User): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update'
    return this.httpClient.post<ResponseModel>(newPath, user);
  }
}
