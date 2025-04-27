import { CartItem } from "../entites/cartItem";
import { PaymentOutputModel } from "./paymentOutputModel";

export interface ConfirmOrderInputModel extends PaymentOutputModel {
    cartItems: CartItem[]
}