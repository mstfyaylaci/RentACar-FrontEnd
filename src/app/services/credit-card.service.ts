import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/responseModel/listResponseModel';
import { Observable } from 'rxjs';
import { CreditCard } from '../models/entites/creditCard';
import { CustomerCreditCardModel } from '../models/paymentModels/customerCreditCardModel';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  apiUrl = 'https://localhost:44327/api/CreditCards/';
  constructor(private httpClient: HttpClient) { }


  getSavedCreditCards(customerId: number): Observable<ListResponseModel<CreditCard>> {
    let newPath = this.apiUrl + "getcreditcardsbycustomerid/" + customerId;
    return this.httpClient.get<ListResponseModel<CreditCard>>(newPath);
  }

  saveCreditCard(customerCreditCardModel: CustomerCreditCardModel) {
    let newPath = this.apiUrl + "savecreditcard";
    return this.httpClient.post<ListResponseModel<CreditCard>>(newPath, customerCreditCardModel);
  }

  deleteCreditCard(customerCreditCardModel: CustomerCreditCardModel) {
    let newPath = this.apiUrl + "deletecreditcard";
    return this.httpClient.post<ListResponseModel<CreditCard>>(newPath,customerCreditCardModel);
  }

  getCreditCardLogoSource(cardNumber: string) {
    if (cardNumber == null) {
      return '';
    } else {
      let startNum = cardNumber.charAt(0)
      if (startNum == '4') {
        return '/assets/images/visa.png'
      } else if (startNum == '5') {
        return '/assets/images/master-card.png'
      } else {
        return '';
      }
    }
  }
}
