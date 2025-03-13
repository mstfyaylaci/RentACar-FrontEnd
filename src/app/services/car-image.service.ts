import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarImage } from '../models/entites/carImage';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {

  apiUrl='https://localhost:44327/api/';
  imageUrl='https://localhost:44327/Uploads/Images/'
  constructor(private httpClient:HttpClient) { }

  getImagePath(imagePath: string) {
    //console.log(this.apiUrl+imagePath);
    return this.imageUrl + imagePath
  }

  getCarImages():Observable<ListResponseModel<CarImage>>{
    let newPath=this.apiUrl+"CarImages/getall" 
    return this.httpClient
    .get<ListResponseModel<CarImage>>(newPath)
  }

  getCarImagesByCar(carId:number):Observable<ListResponseModel<CarImage>>{
    let newPath=this.apiUrl+"CarImages/getbycarid?carId="+carId 
    
    return this.httpClient
    .get<ListResponseModel<CarImage>>(newPath)
  }

  
}

