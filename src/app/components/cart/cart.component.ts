import { Component, OnInit } from '@angular/core';
import { Car } from 'src/app/models/entites/car';
import { CartItem } from 'src/app/models/entites/cartItem';
import { CarImageService } from 'src/app/services/car-image.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  checkOutStep: number = 0;

  cartItems: CartItem[] 
  rentalPeriod: number
  rentalStartDate: string
  rentalEndDate: string

  constructor(private cartService:CartService,
    private carImageService: CarImageService
  ) { }

  ngOnInit(): void {
    this.getCartItems()
  }

  getCartItems(){
    this.cartItems = this.cartService.listCartItem();
    
  }

  removeCartItems(car: Car) {
    this.cartService.removeCartItem(car);
  }

  calculateRentalPeriod(rentDate: Date, returnDate: Date): number {
    const startDate = new Date(rentDate);
    const endDate = new Date(returnDate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(dayDifference);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ayı 2 haneli yapmak için
    const day = ('0' + date.getDate()).slice(-2); // Günü 2 haneli yapmak için
    return `${day}.${month}.${year}`;
  } 

  goCheckOutStep(step: Number) {
    switch (step) {
      case 0: {
        //this.paymentOutputModel = undefined!
        this.checkOutStep = 0;
        break;
      }
      case 1: {
        //this.paymentOutputModel = undefined!
        this.checkOutStep = 1;
        break;
      }
      case 2: {
        this.checkOutStep = 2;
        break;
      }
    }
  }
  
  confirmCart() {
    this.checkOutStep = 1;
  }

  calculateTotalRentalPeriod(): number {
    let totalDays = 0;
    this.cartItems.forEach(item => {
      totalDays += this.calculateRentalPeriod(item.rentDate, item.returnDate);
    });
    return totalDays;
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.cartItems.forEach(item => {
      totalPrice += item.car.dailyPrice * this.calculateRentalPeriod(item.rentDate, item.returnDate);
    });
    return totalPrice;
  }
 

  getImagePath(imagePath: string) {
    
    return this.carImageService.getImagePath(imagePath)
  }
}
