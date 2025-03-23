import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Color } from '../models/entites/color';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel/responseModel';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  apiUrl = 'https://localhost:44327/api/Colors/';

  constructor(private httpClient: HttpClient) { }


  getColors(): Observable<ListResponseModel<Color>> {
    let newPath = this.apiUrl + "getall"
    return this.httpClient.get<ListResponseModel<Color>>(newPath)
  }
  // getColorById(colorId:Number):Observable<ListResponseModel<Color>>{
  //   let newPath=this.apiUrl+"Colors/getbyid?id="+colorId

  //   return this.httpClient
  //   .get<ListResponseModel<Color>>(newPath)
  // }

  addColor(color: Color): Observable<ResponseModel> {
    let newPath = this.apiUrl + "add"

    return this.httpClient.post<ResponseModel>(newPath, color)
  }

  deleteColor(color: Color): Observable<ResponseModel> {
    let newPath = this.apiUrl + "delete"

    return this.httpClient.post<ResponseModel>(newPath, color)
  }

  updateColor(color: Color): Observable<ResponseModel> {
    let newPath = this.apiUrl + "update"

    return this.httpClient.post<ResponseModel>(newPath, color)
  }
}

