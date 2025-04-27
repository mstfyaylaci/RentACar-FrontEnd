import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Customer } from '../models/entites/customer';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/responseModel/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl='https://localhost:44327/api/Customers/';
  constructor(private httpClient:HttpClient) { }

  getCustomers():Observable<ListResponseModel<Customer>>{

    let newPath=this.apiUrl+"getall"
    return this.httpClient.get<ListResponseModel<Customer>>(newPath)
  }

  getCustomerByUserId(userId:number):Observable<SingleResponseModel<Customer>>{
    let newPath=this.apiUrl+"getbyuserid?userid="+userId
    return this.httpClient.get<SingleResponseModel<Customer>>(newPath)
  }

  addCustomer(customer: Customer): Observable<SingleResponseModel<number>> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<SingleResponseModel<number>>(newPath, customer);
  }
}

