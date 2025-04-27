import { RentPaymentRequest } from "./rentPaymentRequest";

export interface PaymentOutputModel {
    rentPaymentRequest: RentPaymentRequest;
    isCreditCardSaving: boolean;
}