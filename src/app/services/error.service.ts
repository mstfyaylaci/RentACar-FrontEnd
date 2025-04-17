import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastrService:ToastrService) { }


  backendError(responseError:any,errorMessage:string){
    
    if (responseError.error.ValidationErrors.length>0) {
      for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {
        this.toastrService.error(responseError.error.ValidationErrors[i].ErrorMessage,"Doğrulama Hatası")
      }
    }
    else{
      this.toastrService.error(responseError.error, errorMessage)
    }
  }
 
  
}
