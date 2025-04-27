import { Injectable } from '@angular/core';
import { Car } from '../models/entites/car';
import { CartItems } from '../models/entites/cartItems';
import { CartItem } from '../models/entites/cartItem';
import { ToastrService } from 'ngx-toastr';
import { DateTimeService } from './date-time.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private toastrService: ToastrService,
    private dateTimeService: DateTimeService
  ) { }

  addToCart(car: Car, rentDate: Date, returnDate: Date): void {
    let item = CartItems.find(c => c.car.id === car.id);
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
    let item = CartItems.find(c => c.car.id === car.id);
    CartItems.splice(CartItems.indexOf(item), 1);
  }

  listCartItem(): CartItem[] {
    return CartItems;
  }

  clearCart() {
    CartItems.length = 0;
    if (CartItems.length === 0) {
      this.toastrService.success("Sepetiniz temizlendi", "Başarılı");
      return true;
    } else {
      this.toastrService.error("Sepetiniz temizlenemedi", "Başarısız");
      return false;
    }
  }

  calculateTotalAmount(): number {
    let totalAmount: number = 0;
    CartItems.forEach(cartItem => {
      let rentalPeriod = this.dateTimeService.getRentalPeriod(cartItem.rentDate, cartItem.returnDate)
      let amount = cartItem.car.dailyPrice * rentalPeriod
      totalAmount += amount;
    });
    return totalAmount;
  }

  calculateTotalRentalPeriod(cartItems: CartItem[]): number {
    let totalRentalPeriod: number = 0
    cartItems.forEach(cartItem => {
      let rentalPeriod: number = this.dateTimeService.getRentalPeriod(cartItem.rentDate, cartItem.returnDate);
      totalRentalPeriod += rentalPeriod;
    });
    return totalRentalPeriod;
  }
}
