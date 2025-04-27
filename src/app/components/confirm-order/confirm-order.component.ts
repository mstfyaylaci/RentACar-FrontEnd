import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/models/entites/cartItem';
import { CreditCard } from 'src/app/models/entites/creditCard';
import { ConfirmOrderInputModel } from 'src/app/models/paymentModels/confirmOrderInputModel';
import { ConfirmOrderOutputModel } from 'src/app/models/paymentModels/confirmOrderOutputModel';
import { CarImageService } from 'src/app/services/car-image.service';
import { CartService } from 'src/app/services/cart.service';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { DateTimeService } from 'src/app/services/date-time.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-confirm-order',
  standalone: false,
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css'
})
export class ConfirmOrderComponent implements OnInit {
 
  @Input() confirmOrderInputModel: ConfirmOrderInputModel;

  @Output() confirmOrderOutputModel: EventEmitter<ConfirmOrderOutputModel> = new EventEmitter<ConfirmOrderOutputModel>();
  
  
  constructor(
    private dateTimeService: DateTimeService,
    private carImagesService: CarImageService,
    private spinner: NgxSpinnerService,
    private rentalService: RentalService,
    private creditCardService: CreditCardService,
    private toastrService: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    
  }

  rent(){
    this.spinner.show();
    this.rentalService.rent(this.confirmOrderInputModel.rentPaymentRequest).subscribe((response) => {
      if (this.confirmOrderInputModel.isCreditCardSaving === true) {
        this.saveCreditCard().then((result) => {
          result === true
            ? this.toastrService.success("Kredi kartı başarıyla kaydedildi", "Kredi kartı kaydedildi")
            : this.toastrService.warning("Kredi kartı kaydedilemedi", "Kredi kartı kaydedilemedi");
        });
      }
      this.toastrService.success(response.message, "Ödeme başarılı")

      let confirmOrderOutputModel = {
        numberOfTotalRentedCar: this.confirmOrderInputModel.cartItems.length,
        totalRentalDays: this.calculateTotalRentalPeriod(this.confirmOrderInputModel.cartItems),
        totalAmount: this.calculateTotalAmount(this.confirmOrderInputModel.cartItems),
        rentDate: this.dateTimeService.getFullDateTimeNow(),
        paymentId: response.data
      };

     
      this.confirmOrderOutputModel.emit(confirmOrderOutputModel);
      this.spinner.hide();

    },error=> {
      this.toastrService.error(error.error.message, "Ödeme başarısız")
        this.spinner.hide();
    })
  }

  saveCreditCard(): Promise<boolean> {
    return new Promise<boolean>((methodResolve) => {
      let creditCard = new CreditCard;
      let rentPaymentRequest = this.confirmOrderInputModel.rentPaymentRequest
      creditCard.cardNumber = rentPaymentRequest.cardNumber;
      creditCard.expireYear = rentPaymentRequest.expireYear;
      creditCard.expireMonth = rentPaymentRequest.expireMonth;
      creditCard.cvc = rentPaymentRequest.cvc;
      creditCard.cardHolderFullName = rentPaymentRequest.cardHolderFullName;

      let customerCreditCardModel = {
        creditCard: creditCard,
        customerId: rentPaymentRequest.customerId
      }
      console.log(customerCreditCardModel);
      this.creditCardService.saveCreditCard(customerCreditCardModel).subscribe(() => {
        methodResolve(true);
      }, () => {
        methodResolve(false);
      })
    })
  }

  calculateTotalAmount(cartItems: CartItem[]): number {
    let totalAmount: number = 0;
    cartItems.forEach(cartItem => {
      let rentalPeriod = this.getRentalPeriod(cartItem.rentDate, cartItem.returnDate)
      let amount = cartItem.car.dailyPrice * rentalPeriod
      totalAmount += amount;
    });
    return totalAmount;
  }

  getCreditCardLogoSource(cardNumber: string) {
    return this.creditCardService.getCreditCardLogoSource(cardNumber);
  }
  calculateTotalRentalPeriod(cartItems: CartItem[]): number {
    return this.cartService.calculateTotalRentalPeriod(cartItems);
  }

  getRentalPeriod(rentDate: Date, returnDate: Date): number {
    return this.dateTimeService.getRentalPeriod(rentDate, returnDate);
  }

  getImagePath(imagePath: string) {
    return this.carImagesService.getImagePath(imagePath);
  }

  showDate(date: Date) {
    return this.dateTimeService.showDate(date);
  }
}
