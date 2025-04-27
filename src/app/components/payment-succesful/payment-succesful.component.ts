import { Component, Input } from '@angular/core';
import { ConfirmOrderOutputModel } from 'src/app/models/paymentModels/confirmOrderOutputModel';

@Component({
  selector: 'app-payment-succesful',
  standalone: false,
  templateUrl: './payment-succesful.component.html',
  styleUrl: './payment-succesful.component.css'
})
export class PaymentSuccesfulComponent {

  @Input() confirmOrderOutputModel: ConfirmOrderOutputModel;
}
