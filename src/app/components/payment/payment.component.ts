import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserForLogin } from 'src/app/models/auth/userForLogin';
import { CartItem } from 'src/app/models/entites/cartItem';
import { CreditCard } from 'src/app/models/entites/creditCard';
import { Customer } from 'src/app/models/entites/customer';
import { Rental } from 'src/app/models/entites/rental';
import { PaymentOutputModel } from 'src/app/models/paymentModels/paymentOutputModel';
import { RentPaymentRequest } from 'src/app/models/paymentModels/rentPaymentRequest';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { CustomerService } from 'src/app/services/customer.service';
import { DateTimeService } from 'src/app/services/date-time.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{

  paymentForm: FormGroup;
  currentUser: UserForLogin;

  paySavedCard: boolean = false;
  savedCreditCards: CreditCard[] = [];
  selectedSavedCreditCard: number = 0;
  isCreditCardSaving: boolean = false;

  @Input() cartItems: CartItem[];
  @Output() paymentOutputModel: EventEmitter<PaymentOutputModel> = new EventEmitter<PaymentOutputModel>();
  /**
   *
   */
  constructor(
    private customerService: CustomerService,
    private creditCardService: CreditCardService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cartService:CartService,
    private dateTimeService: DateTimeService,
  ) {
    
  }
  ngOnInit(): void {
    this.createPaymentForm();
    this.currentUser = this.authService.getUser()!;
    this.getCustomerId().then(customerId => {
      this.getSavedCreditCards(customerId).then((savedCreditCards) => {
        savedCreditCards.forEach(creditCard => {
          this.savedCreditCards.push(creditCard);
        });
        this.paySavedCard = this.savedCreditCards.length > 0 ? true : false
      });
    })
  }

  createPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: ["", [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      cardHolderFullName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      expireYear: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      expireMonth: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      cvc: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    });
  }

  createRentals(customerId: number): Rental[] {
    let rentals: Rental[] = [];

    this.cartItems.forEach(cartItem => {
      let rental: Rental = new Rental;
      rental.carId = cartItem.car.id;
      rental.customerId = customerId;
      rental.rentDate = cartItem.rentDate;
      rental.returnDate = cartItem.returnDate;
      rentals.push(rental);
    });
    return rentals;
  }

  confirmCreditCard() {
    if (this.paySavedCard) {
      let usingCard: CreditCard = this.savedCreditCards[this.selectedSavedCreditCard];
      this.paymentForm.setValue({
        cardNumber: usingCard.cardNumber,
        cardHolderFullName: usingCard.cardHolderFullName,
        expireYear: usingCard.expireYear,
        expireMonth: usingCard.expireMonth,
        cvc: usingCard.cvc
      });
    }

    if (this.paymentForm.valid) {
      this.getCustomerId().then(customerId => {
        let rentRequest: RentPaymentRequest = Object.assign({}, this.paymentForm.value);
        rentRequest.customerId = customerId;
        rentRequest.amount= this.calculateTotalAmount();
        rentRequest.rentals = this.createRentals(customerId);

        let paymentOutputModel: PaymentOutputModel = {
          rentPaymentRequest: rentRequest,
          isCreditCardSaving: this.isCreditCardSaving
        };
        this.paymentOutputModel.emit(paymentOutputModel);
        this.paymentForm.reset();
      },() => {})
    }
    else{
      this.toastrService.error("Lütfen kart bilgilerinizi eksiksiz doldurunuz", "Kart bilgileri eksik")
    }
  }

  getCustomerId(): Promise<number> {
    return new Promise<number>((methodResolve) => {
      this.customerService.getCustomerByUserId(this.currentUser.id).subscribe(successResult => {
        methodResolve(successResult.data.id);
      }, () => {  //If the user is not a customer, save it as a customer
        let addedCustomer = new Customer;
        addedCustomer.userId = this.currentUser.id;
        addedCustomer.companyName = "Test Company Name";
        this.customerService.addCustomer(addedCustomer).subscribe(successAddedResult => {
          methodResolve(successAddedResult.data);
        })
      })
    })
  }

  getRentalPeriod(rentDate: Date, returnDate: Date): number {
    return this.dateTimeService.getRentalPeriod(rentDate, returnDate);
  }

  calculateTotalAmount(): number {
    return this.cartService.calculateTotalAmount();
  }

  getSavedCreditCards(customerId: number): Promise<CreditCard[]> {
    return new Promise<CreditCard[]>((methodResolve) => {
      this.creditCardService.getSavedCreditCards(customerId).subscribe((successResult) => {
        methodResolve(successResult.data);
      }, () => {
        methodResolve([]);
      });
    })
  }
  resetSelectedSavedCreditCard() {
    this.selectedSavedCreditCard = 0;
  }

  getCreditCardLogoSource(cardNumber: string) {
    return this.creditCardService.getCreditCardLogoSource(cardNumber);
  }

  deleteCreditCard(creditCard: CreditCard) {
    this.getCustomerId().then((customerId) => {
      let customerCreditCardModel = {
        creditCard: creditCard,
        customerId: customerId
      }
      this.creditCardService.deleteCreditCard(customerCreditCardModel).subscribe(() => {
        this.getSavedCreditCards(customerId).then(savedCreditCards => {
          this.savedCreditCards = savedCreditCards;
          if (this.savedCreditCards.length === 0) {
            this.paySavedCard = false;
          }
        })
        this.toastrService.success("Kayıtlı kredi kartınız başarıyla silindi", "Kredi kartı silindi");
      }, () => {
        this.toastrService.error("Kayıtlı kredi kartınız silinirken bir sorun oluştu", "Kredi kartı silinemedi");
      })
    })
  }

  // increaseSelectedCreditCardIndex() {
  //   let savedCreditCardsCarousel = document.getElementsByClassName("carousel-item");
  //   for (let i = 0; i < savedCreditCardsCarousel.length; i++) {
  //     if (savedCreditCardsCarousel[i].className.search("active") != -1) {
  //       let selectedCreditCardIndex = Number(savedCreditCardsCarousel[i].getAttribute("data-index"))
  //       if (selectedCreditCardIndex < this.savedCreditCards.length - 1 && selectedCreditCardIndex == this.selectedSavedCreditCard) { //Bu işlemi yapmamın sebebi, bir önceki satırda tespit edilen index değerinin aslında tıklamadan hemen önceki index değeri olmasıdır. Bu metod carousel'de bir sonraki itemin indexini vereceği için tespit edilen index değerini bir arttırarak gerçek index değerine ulaşıyorum. İkinci koşulu eklememin sebebi ise, sol ok tuşuna basıldığında (decreaseSelectedCreditCardIndex metodu çağırıldığında) kredi kartı DEĞİŞİRKEN sağ ok tuşuna basılırsa (bu metod çağırılırsa) doğru index değerini yakalamaktır.
  //         selectedCreditCardIndex += 1;
  //         this.selectedSavedCreditCard = selectedCreditCardIndex;
  //       }
  //     }
  //   }
  // }
  increaseSelectedCreditCardIndex() {
    const activeCard = document.querySelector(".carousel-item.active") as HTMLElement;
    if (activeCard) {
      const selectedCreditCardIndex = Number(activeCard.getAttribute("data-index"));
      if (selectedCreditCardIndex < this.savedCreditCards.length - 1 && selectedCreditCardIndex === this.selectedSavedCreditCard) {
        this.selectedSavedCreditCard = selectedCreditCardIndex + 1;
      }
    }
  }


// decreaseSelectedCreditCardIndex() {
//   let savedCreditCardsCarousel = document.getElementsByClassName("carousel-item");
//   for (let i = 0; i < savedCreditCardsCarousel.length; i++) {
//     if (savedCreditCardsCarousel[i].className.search("active") != -1) {
//       let selectedCreditCardIndex = Number(savedCreditCardsCarousel[i].getAttribute("data-index"))
//       if (selectedCreditCardIndex > 0 && selectedCreditCardIndex == this.selectedSavedCreditCard) { //Bu işlemi yapmamın sebebi, bir önceki satırda tespit edilen index değerinin aslında tıklamadan hemen önceki index değeri olmasıdır. Bu metod carousel'de bir öncei itemin indexini vereceği için tespit edilen index değerini bir azaltarak gerçek index değerine ulaşıyorum. İkinci koşulu eklememin sebebi ise, sağ ok tuşuna basıldığında (increaseSelectedCreditCardIndex metodu çağırıldığında) kredi kartı DEĞİŞİRKEN sol ok tuşuna basılırsa (bu metod çağırılırsa) doğru index değerini yakalamaktır.
//         selectedCreditCardIndex -= 1;
//         this.selectedSavedCreditCard = selectedCreditCardIndex;
//       }
//     }
//   }
// }


  decreaseSelectedCreditCardIndex() {
    const activeCard = document.querySelector(".carousel-item.active") as HTMLElement;
    if (activeCard) {
      const selectedCreditCardIndex = Number(activeCard.getAttribute("data-index"));
      if (selectedCreditCardIndex > 0 && selectedCreditCardIndex === this.selectedSavedCreditCard) {
        this.selectedSavedCreditCard = selectedCreditCardIndex - 1;
      }
    }
  }
  



}

