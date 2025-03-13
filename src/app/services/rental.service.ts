import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Rental } from '../models/entites/rental';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/responseModel/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  apiUrl='https://localhost:44327/api/Rentals/';
  constructor(private httpClient:HttpClient) { }

  getRentals():Observable<ListResponseModel<Rental>>{
    let newPath =this.apiUrl+"getall"
    return this.httpClient
    .get<ListResponseModel<Rental>>(newPath)
  }

  getRentalById(rentalId:Number):Observable<ListResponseModel<Rental>>{
    let newPath=this.apiUrl+"getbyid?id="+rentalId
    
    return this.httpClient
    .get<ListResponseModel<Rental>>(newPath)
  }

  checkIfCarAvailableNow(carId:Number):Observable<SingleResponseModel<boolean>>{
    let newPath=this.apiUrl+"checkifcancarberentednow?carId="+carId 
    
    return this.httpClient
    .get<SingleResponseModel<boolean>>(newPath)
  }

  checkIfCanCarBeRentedBetweenSelectedDates(carId:number,rentDate:string,returnDate:string):Observable<SingleResponseModel<boolean>>{

    let newPath = this.apiUrl + 
    'checkifcancarberentedbetweenselecteddates?carId=' + carId + 
    '&rentDate=' + rentDate + 
    '&returnDate=' + returnDate;

    return this.httpClient
    .get<SingleResponseModel<boolean>>(newPath)

  }
}
