import { Rental } from "../entites/rental";

export interface RentPaymentRequest{
    cardNumber:string;
    expireYear:string;
    expireMonth:string;
    cvc:string;
    cardHolderFullName:string;
    customerId:number;
    rentals:Rental[];
    amount:number;
}