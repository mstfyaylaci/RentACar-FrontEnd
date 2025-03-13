import { Injectable } from '@angular/core';
import { CarDetail } from '../models/entites/carDetail';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { SingleResponseModel } from '../models/responseModel/singleResponseModel';
import { Car } from '../models/entites/car';

@Injectable({
  providedIn: 'root'
})
export class CarDetailService {

  apiUrl='https://localhost:44327/api/Cars/';
  constructor(private httpClient:HttpClient) { }


  getAllCarDetails():Observable<ListResponseModel<CarDetail>>{

    let newPath=this.apiUrl+"getcardetails"
    return this.httpClient
    .get<ListResponseModel<CarDetail>>(newPath)
  }

  getCarDetailsByCarId(carId:number):Observable<SingleResponseModel<Car>>{

    let newPath=this.apiUrl+"getcardetailsid?carId="+carId
    return this.httpClient
            .get<SingleResponseModel<Car>>(newPath)
    
  }

  
}

