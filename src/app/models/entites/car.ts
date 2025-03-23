import { CarImage } from "./carImage";


export interface Car{
    id:number,
    brandId:number,
    colorId:number,
    brandName:string,
    colorName:string,
    carName:string,
    modelYear:number,
    dailyPrice:number,
    description:string,
    carImages:CarImage[]


}