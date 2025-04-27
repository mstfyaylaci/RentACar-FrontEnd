import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserForLogin } from 'src/app/models/auth/userForLogin';
import { Car } from 'src/app/models/entites/car';
import { CartItem } from 'src/app/models/entites/cartItem';
import { ConfirmOrderOutputModel } from 'src/app/models/paymentModels/confirmOrderOutputModel';
import { PaymentOutputModel } from 'src/app/models/paymentModels/paymentOutputModel';
import { CarImageService } from 'src/app/services/car-image.service';
import { CartService } from 'src/app/services/cart.service';
import { DateTimeService } from 'src/app/services/date-time.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  checkOutStep: number = 0;
  cartItems: CartItem[] ;
  currentUser:UserForLogin

  paymentOutputModel: PaymentOutputModel;
  confirmOrderOutputModel: ConfirmOrderOutputModel;

  rentalPeriod: number
  rentalStartDate: string
  rentalEndDate: string

  constructor(
    private cartService:CartService,
    private carImageService: CarImageService,
    private toastrService: ToastrService,
    private dateTimeService: DateTimeService,
  ) { }


  
  ngOnInit(): void {
    this.resetCart()
    this.getCartItems()
    
  }

  goCheckOutStep(step: Number) {
    switch (step) {
      case 0: {
        this.paymentOutputModel = undefined!
        this.checkOutStep = 0;
        break;
      }
      case 1: {
        this.paymentOutputModel = undefined!
        this.checkOutStep = 1;
        break;
      }
      case 2: {
        this.checkOutStep = 2;
        break;
      }
    }
  }

  setPaymentOutputModel(paymentOutputModel: PaymentOutputModel) {
    console.log("setpaymentOutputModel", paymentOutputModel);
    this.paymentOutputModel = paymentOutputModel;
    this.checkOutStep = 2;
  }

  createConfirmOrderInputModel() {
    let confirmOrderInputModel = {
      cartItems: this.cartItems,
      isCreditCardSaving: this.paymentOutputModel.isCreditCardSaving,
      rentPaymentRequest: this.paymentOutputModel.rentPaymentRequest
    };

    return confirmOrderInputModel;
  }

  setConfirmOrderOutputModel(confirmOrderOutputModel: ConfirmOrderOutputModel) {
    this.confirmOrderOutputModel = confirmOrderOutputModel;
    console.log(confirmOrderOutputModel);
    this.finishPayment();
  }

  finishPayment() {
    this.cartService.clearCart();
    this.checkOutStep = 0;
    this.cartItems = [];
    this.paymentOutputModel = undefined!
  }

  getCartItems(){
    this.cartItems = this.cartService.listCartItem();
    
  }

  removeCartItems(car: Car) {
    this.cartService.removeCartItem(car);
  }


  resetCart() {
    this.checkOutStep = 0;
    this.cartItems = [];
    this.paymentOutputModel = undefined!
    this.confirmOrderOutputModel = undefined!
  }
  
  confirmCart() {
    this.checkOutStep = 1;
  }

  getRentalPeriod(rentDate: Date, returnDate: Date): number {
    return this.dateTimeService.getRentalPeriod(rentDate, returnDate);
  }

  

  showDate(date: Date) {
    return this.dateTimeService.showDate(date);
  }
  
  calculateTotalRentalPeriod(): number {
    return this.cartService.calculateTotalRentalPeriod(this.cartItems);
  }

  calculateTotalAmount(): number {
    return this.cartService.calculateTotalAmount();
  }
 

  getImagePath(imagePath: string) {
    
    return this.carImageService.getImagePath(imagePath)
  }
}
