import { Injectable } from '@angular/core';
import { Car } from '../models/entites/car';
import { CartItems } from '../models/entites/cartItems';
import { CartItem } from '../models/entites/cartItem';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private toastrService: ToastrService) { }

  addToCart(car: Car, rentDate: Date, returnDate: Date): void {
    let item = CartItems.find(c => c.car.carId === car.carId);
    if (item) {
      this.toastrService.warning("Araç zaten sepetinizde", "Dikkat");
    } else {
      let cartItem = new CartItem();
      cartItem.car = car;
      cartItem.rentDate = rentDate;
      cartItem.returnDate = returnDate;
      
      CartItems.push(cartItem);
      this.toastrService.success("Araç sepete eklendi", "Başarılı");
      console.log(CartItems);
    }
  }

  removeCartItem(car: Car): void {
    let item = CartItems.find(c => c.car.carId === car.carId);
    CartItems.splice(CartItems.indexOf(item), 1);
  }

  listCartItem(): CartItem[] {
    return CartItems;
  }
}
