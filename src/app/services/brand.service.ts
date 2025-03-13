import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Brand } from '../models/entites/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  apiUrl='https://localhost:44327/api/Brands/';

  constructor(private httpClient:HttpClient) { }

  getBrands():Observable<ListResponseModel<Brand>>{

    let newPath=this.apiUrl+"getall"

    return this.httpClient.get<ListResponseModel<Brand>>(newPath)
  }

  getBrandById(brandId:Number):Observable<ListResponseModel<Brand>>{
    let newPath=this.apiUrl+"getbyid?id"+brandId
    
    return this.httpClient
    .get<ListResponseModel<Brand>>(newPath)
  }

  
}