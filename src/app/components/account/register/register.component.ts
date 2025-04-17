import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfirmedValidator } from 'src/app/validator/confirmValidator';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  rememberMe: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private errorService:ErrorService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() :void{
    this.createRegisterForm()
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]]
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  register() {
    // Registration logic here
    if (this.registerForm.valid) {
      let newUser=Object.assign({},this.registerForm.value)
      
      this.authService.register(newUser).subscribe(response=>{
        localStorage.setItem("token",response.data.token)
        if (this.rememberMe) {
          this.saveEmail(newUser.email);
        }
        this.authService.isLoggedIn = true;
        this.router.navigate([""]);
        this.toastrService.success("İşlem başarılı", "Kayıt yapıldı");
      }, errorResponse => {
        //this.toastrService.error(errorResponse.error, "Kayıt yapılamadı") 
        this.errorService.backendError(errorResponse, "Kayıt başarısız");
      })
      
    }
    else {
      this.toastrService.error("Bilgilerinizden bazıları doğrulanamadı", "Formunuz hatalı");
    }
  }
  

  saveEmail(email:string){
    this.localStorageService.add("remember",email);
  }

}

