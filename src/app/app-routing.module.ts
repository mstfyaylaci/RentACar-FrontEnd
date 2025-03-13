import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HomeLayaoutComponent } from './components/home-layaout/home-layaout.component';
import { CarDetailsComponent } from './components/car-details/car-details.component';
import { CartComponent } from './components/cart/cart.component';

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
      
    ]
  },
  
  
  //{path:"cars/add", component:CarAddComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
