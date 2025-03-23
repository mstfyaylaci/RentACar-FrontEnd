import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomeLayaoutComponent } from './components/home-layaout/home-layaout.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { CartComponent } from './components/cart/cart.component';
import { BrandManagerComponent } from './components/admin/admin-brand/brand-manager/brand-manager.component';
import { ColorManagerComponent } from './components/admin/admin-color/color-manager/color-manager.component';
import { CarManagerComponent } from './components/admin/admin-car/car-manager/car-manager.component';

const routes: Routes = [
 
  { path:"",pathMatch:"full" ,component:HomeComponent},
  {path:"cars",component:HomeComponent},
  {path:"brand/:brandId",component:HomeComponent},
  {path:"color/:colorId",component:HomeComponent},
  {path:"brand/:brandId/color/:colorId", component:HomeComponent},

  {
    path: '', component: HomeLayaoutComponent, children: [
      { path: 'cars/carDetail/:carId', component: CarDetailsComponent },
      { path: "cart", component: CartComponent },
      {
        path: 'admin', component: HomeLayaoutComponent, children: [
          { path: 'brand/manager', component: BrandManagerComponent},
          { path: 'color/manager', component: ColorManagerComponent,  },
          { path: 'car/manager', component: CarManagerComponent, },
        ]
      }
    ]
  },
  
  
  //{path:"cars/add", component:CarAddComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
