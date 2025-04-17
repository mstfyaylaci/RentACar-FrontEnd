import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token =localStorage.getItem("token")

    let newRequest: HttpRequest<any>;

    newRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + token)
    });
   
    return next.handle(newRequest)
      
  }
}
