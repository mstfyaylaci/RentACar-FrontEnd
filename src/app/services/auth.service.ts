import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/auth/loginModel';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenModel } from '../models/auth/tokenModel';
import { SingleResponseModel } from '../models/responseModel/singleResponseModel';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';
import { UserForLogin } from '../models/auth/userForLogin';
import { RegisterModel } from '../models/auth/registerModel';
import { ResponseModel } from '../models/responseModel/responseModel';
import { ChangePasswordModel } from '../models/auth/changePasswordModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  apiUrl = 'https://localhost:44327/api/Auth/';

  private loggedIn = new BehaviorSubject<boolean>(this.isTokenExpired());

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelperService: JwtHelperService
  ) { }


  // Giriş durumu observable olarak dışarıya sunuluyor (başka component'ler dinleyebilir)
  public get loginStatus() {
    return this.loggedIn.asObservable();
  }

  // Anlık giriş durumu (sadece değer olarak)
  public get isLoggedIn() {
    return this.loggedIn.getValue();
  }

  // Giriş durumu dışarıdan ayarlanabilir (örneğin giriş yaptıktan sonra)
  public set isLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  // Token süresi dolmuş mu kontrolü yapar
  private isTokenExpired(): boolean {
    let token = this.getToken();
    if (token != null) {
      // Token varsa ve süresi dolmadıysa true döner
      return !this.jwtHelperService.isTokenExpired(token);
    }
    return false; // Token yoksa false döner
  }

  // LocalStorage'dan token'ı alır
  private getToken(): string | null {
    return localStorage.getItem("token");
  }


  login(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    let newPath = this.apiUrl + "login";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(newPath, loginModel);
  }

  // Çıkış işlemi: token silinir ve login durumu false yapılır
  logOut() {
    this.localStorageService.remove("token");
    this.loggedIn.next(false);
  }

  register(registerModel:RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    let newPath = this.apiUrl + "register";
    return this.httpClient.post<SingleResponseModel<TokenModel>>(newPath, registerModel);
   
  }

  // Token'dan kullanıcı bilgilerini çözer ve UserForLogin nesnesi döner
  getUser(): UserForLogin | undefined {
    let token = this.getToken();
    if (token != null) {
      // Token'daki tüm bilgileri alır
      let tokenDetails = Object.entries(this.jwtHelperService.decodeToken(token));
      let user: UserForLogin = new UserForLogin();
      tokenDetails.forEach(detail => {
        switch (detail[0]) {
          case "email": {
            user.email = String(detail[1]);
            break;
          }
          case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": {
            user.name = String(detail[1]);
            break;
          }
          case "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": {
            // Roller string dizisi olabilir
            user.roles = detail[1] as Array<string>;
            break;
          }
          case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": {
            user.id = Number(detail[1]);
          }
        }
      });
      
      // Eğer kullanıcıya ait role bilgisi yoksa boş bir dizi atanır
      if (!user.roles) {
        user.roles = [];
      }

      return user;
    }

    // Token yoksa undefined döner
    return undefined;
  }

  // Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
  hasRole(user: UserForLogin, role: string): boolean {
    return user.roles.indexOf(role) !== -1;
  }

  // Şifre değiştirme isteği atar
  changePassword(updatedUser: ChangePasswordModel): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'auth/changepassword';
    return this.httpClient.post<ResponseModel>(newPath, updatedUser);
  }

  
}
