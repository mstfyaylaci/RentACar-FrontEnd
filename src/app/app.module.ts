import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrandComponent } from './components/brand/brand.component';
import { ColorComponent } from './components/color/color.component';
import { HomeComponent } from './components/home/home.component';
import { HomeLayaoutComponent } from './components/home-layaout/home-layaout.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CustomerComponent } from './components/customer/customer.component';
import { FooterComponent } from './components/footer/footer.component';
import { NaviComponent } from './components/navi/navi.component';
import { RentalComponent } from './components/rental/rental.component';
import { FilterBrandPipe } from './pipes/filter-brand.pipe';
import { FilterCarPipe } from './pipes/filter-car.pipe';
import { FilterColorPipe } from './pipes/filter-color.pipe';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaymentComponent } from './components/payment/payment.component';
import { AdminLayaoutComponent } from './components/admin/admin-layaout/admin-layaout.component';
import { BrandAddComponent } from './components/admin/admin-brand/brand-add/brand-add.component';
import { BrandUpdateComponent } from './components/admin/admin-brand/brand-update/brand-update.component';
import { BrandDeleteComponent } from './components/admin/admin-brand/brand-delete/brand-delete.component';
import { BrandManagerComponent } from './components/admin/admin-brand/brand-manager/brand-manager.component';
import { ColorManagerComponent } from './components/admin/admin-color/color-manager/color-manager.component';
import { ColorAddComponent } from './components/admin/admin-color/color-add/color-add.component';
import { ColorDeleteComponent } from './components/admin/admin-color/color-delete/color-delete.component';
import { ColorUpdateComponent } from './components/admin/admin-color/color-update/color-update.component';
import { CarAddComponent } from './components/admin/admin-car/car-add/car-add.component';
import { CarDeleteComponent } from './components/admin/admin-car/car-delete/car-delete.component';
import { CarUpdateComponent } from './components/admin/admin-car/car-update/car-update.component';
import { CarManagerComponent } from './components/admin/admin-car/car-manager/car-manager.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { AccountLayaoutComponent } from './components/account/account-layaout/account-layaout.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    AppComponent,
    BrandComponent,
    ColorComponent,
    HomeComponent,
    HomeLayaoutComponent,
    CarDetailsComponent,
    CartComponent,
    CartSummaryComponent,
    CustomerComponent,
    FooterComponent,
    NaviComponent,
    RentalComponent,
    FilterBrandPipe,
    FilterCarPipe,
    FilterColorPipe,
    PaymentComponent,
    AdminLayaoutComponent,
    BrandAddComponent,
    BrandUpdateComponent,
    BrandDeleteComponent,
    BrandManagerComponent,
    ColorManagerComponent,
    ColorAddComponent,
    ColorDeleteComponent,
    ColorUpdateComponent,
    CarAddComponent,
    CarDeleteComponent,
    CarUpdateComponent,
    CarManagerComponent,
    LoginComponent,
    RegisterComponent,
    AccountLayaoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MatDialogModule  ,
    HttpClientModule ,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-right"
    })
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
