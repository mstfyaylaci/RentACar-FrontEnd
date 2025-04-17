import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm:FormGroup
  rememberMe: boolean = false;
  rememberedEmail: any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.createLoginForm()
    this.autoFillEmail()
    this.checkRememberedUser()
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  login(){
    if (this.loginForm.valid) {
      let user=Object.assign({},this.loginForm.value)

      this.authService.login(user).subscribe(response=>{
       
        this.localStorageService.add("token",response.data.token)
        if (this.rememberMe) {
          this.saveEmail(user.email);
        }
        this.authService.isLoggedIn = true;
        this.router.navigate([""]);
        this.toastrService.success("İşlem başarılı", "Giriş yapıldı");
      },
      errorResponse => {
        this.authService.isLoggedIn = false;
        
        this.errorService.backendError(errorResponse, "Giriş yapılamadı")
        //this.toastrService.error(errorResponse.error.ErrorMessage, "Giriş yapılamadı");
      })
    }
  }

  autoFillEmail(){
    if (this.rememberedEmail) {
      let email=this.localStorageService.getItem("remember");
      if (email !=null) {
        this.loginForm.get("email")?.setValue(email);
      }
    }
  }

  checkRememberedUser(){
    let result=this.localStorageService.getItem("remember")

    if (result!=null) {
      this.rememberedEmail=result
    }
    else{
      this.rememberedEmail=undefined
    }
  }
  
  saveEmail(email:string){
    this.localStorageService.add("remember",email);
  }
  deleteRememberedEmail() {
    this.localStorageService.remove("remember");
  }
}
