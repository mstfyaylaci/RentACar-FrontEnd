import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Observable } from 'rxjs';
import { Car } from '../models/entites/car';
import { ResponseModel } from '../models/entites/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  apiUrl='https://localhost:44327/api/Cars/';

  constructor(private httpClient:HttpClient) { }

  getCars():Observable<ListResponseModel<Car>>{

    let newPath=this.apiUrl+"getcardetails"
    return this.httpClient
    .get<ListResponseModel<Car>>(newPath)
  }

  
  getCarById(carId:Number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl+"getbyid?id="+carId
    
    return this.httpClient
    .get<ListResponseModel<Car>>(newPath)
  }

  getCarsDetail():Observable<ListResponseModel<Car>>{

    let newPath=this.apiUrl+"getcardetails"
    return this.httpClient
    .get<ListResponseModel<Car>>(newPath)
  }
  
  getCarsByBrandId(brandId:Number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl+"getcarbybrandiddetails?brandId="+brandId
    
    return this.httpClient
    .get<ListResponseModel<Car>>(newPath)
  }
  
  getCarsByColorId(colorId:Number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl+"getcarbycoloriddetails?colorId="+colorId
    
    return this.httpClient
    .get<ListResponseModel<Car>>(newPath)
  }
  
  getCarsByBrandAndColor(brandId:number,colorId:Number):Observable<ListResponseModel<Car>>{
    let newPath=this.apiUrl+"getcarbybrandandcolor?brandId="+brandId+"&colorId="+colorId
    
    return this.httpClient
    .get<ListResponseModel<Car>>(newPath)
  }

  addCar(car:Car):Observable<ResponseModel>{
    let newPath=this.apiUrl+"add"

    return this.httpClient.post<ResponseModel>(newPath,car)
  }

  
}