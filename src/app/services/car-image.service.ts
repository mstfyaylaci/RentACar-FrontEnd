import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarImage } from '../models/entites/carImage';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {

  apiUrl='https://localhost:44327/api/CarImages/';
  imageUrl='https://localhost:44327/Uploads/Images/'
  constructor(private httpClient:HttpClient) { }

  getImagePath(imagePath: string) {
    //console.log(this.apiUrl+imagePath);
    return this.imageUrl + imagePath
  }

  getCarImages():Observable<ListResponseModel<CarImage>>{
    let newPath=this.apiUrl+"getall" 
    return this.httpClient
    .get<ListResponseModel<CarImage>>(newPath)
  }

  getCarImagesByCar(carId:number):Observable<ListResponseModel<CarImage>>{
    let newPath=this.apiUrl+"getbycarid?carId="+carId 
    
    return this.httpClient
    .get<ListResponseModel<CarImage>>(newPath)
  }

  uploadCarImage(image: File,carId:number): Observable<ResponseModel> {
     const newPath = this.apiUrl + "add"; // API'nin `add` endpoint'i
    const sendForm = new FormData(); // FormData nesnesi oluştur
    sendForm.append('carId', carId.toString()); // Araba ID'sini string olarak ekle
    sendForm.append('file', image, image.name); // Dosyayı FormData'ya ekle
    
    return this.httpClient.post<ResponseModel>(newPath, sendForm);  // POST isteği gönder
  }

  
}

