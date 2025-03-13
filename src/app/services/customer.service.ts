import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Customer } from '../models/entites/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl='https://localhost:44327/api/';
  constructor(private httpClient:HttpClient) { }

  getCustomers():Observable<ListResponseModel<Customer>>{

    let newPath=this.apiUrl+"Customers/getall"
    return this.httpClient.get<ListResponseModel<Customer>>(newPath)
  }

  // getCustomerById(customerId:Number):Observable<ListResponseModel<Customer>>{
  //   let newPath=this.apiUrl+"Customers/getbyid?id="+customerId
    
  //   return this.httpClient
  //   .get<ListResponseModel<Customer>>(newPath)
  // }
}

