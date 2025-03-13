import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/entites/car';
import { CarDetail } from 'src/app/models/entites/carDetail';
import { CarImage } from 'src/app/models/entites/carImage';
import { SingleResponseModel } from 'src/app/models/responseModel/singleResponseModel';
import { CarDetailService } from 'src/app/services/car-detail.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-car-details',
  standalone: false,
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css'
})
export class CarDetailsComponent implements OnInit {
  
  carDataLoaded=false
  currentCar:Car;

  carsOfCurrentBrand: Car[] = [];

  carDetails: CarDetail[] = []
  carImageDetail:CarImage[]=[]
  //baseUrl="https://localhost:44327/Uploads/Images/";

  rentalStartDate: string 
  rentalEndDate: string 
  validateRentalDates:boolean=false
  isCarCanBeRentedNow:boolean
  rentalPeriod: number;
  today: string = new Date().toISOString().split('T')[0];
  rentalConfirmation:SingleResponseModel<boolean>

  constructor(
    private carDetailService: CarDetailService,
    private activatedRoute: ActivatedRoute,
    private carImageService:CarImageService,
    private carService:CarService,
    private rentalService:RentalService,
    private toastrService:ToastrService,
    private cartService:CartService,
   
    
  ) { }



  ngOnInit(): void {

    
    this.activatedRoute.params.subscribe((params) => {
      if (params["carId"]) {
        this.getCarDetailsByCarId(params["carId"]).then(()=>{
          this.getCarsOfCurrentBrand();
          this.rentalStartDate=undefined!
          this.rentalEndDate=undefined!
          this.isCarCanBeRentedNow=false
          this.rentalPeriod=undefined!
          this.validateRentalDates=false
          this.rentalConfirmation=undefined!

        });
        this.getCarImagesByCarId(params["carId"])
        
      }
     
      
    })
  }


  getCarDetailsByCarId(carId: number) { 
    return new Promise<void>((resolve, reject) => {
      this.carDetailService.getCarDetailsByCarId(carId).subscribe((response) => {
        this.currentCar = response.data
        this.carDataLoaded=true
        resolve();
      })
    });
  }

  openModal(carId: number){
    this.resetDate()
    this.getCarDetailsByCarId(carId)
    this.checkIfCarAvailableNow(carId)
  }
 

  getCarImagesByCarId(carId:number){
    this.carImageService.getCarImagesByCar(carId).subscribe(response=>{
      
      this.carImageDetail=response.data
      
    })
  }

  addToCart(car:Car,rentDate:Date,returnDate:Date){
    this.cartService.addToCart(car,rentDate,returnDate)
   

    
  }

  
  checkIfCarAvailableNow(carId:number){
    this.rentalService.checkIfCarAvailableNow(carId).subscribe(response=>{
      this.isCarCanBeRentedNow =response.data
     
     })
     return this.isCarCanBeRentedNow
  }

  checkIfCanCarBeRentedBetweenSelectedDates(carId:number,rentDate:string,returnDate:string){
    if (!carId || !rentDate || !returnDate) {
      return
    }
    this.rentalService.checkIfCanCarBeRentedBetweenSelectedDates(carId,rentDate,returnDate).subscribe(response=>{
      this.toastrService.success(response.message)
      
      this.rentalConfirmation=response
    },responseError=>{
      
      this.rentalConfirmation=responseError.error
      
      // if (responseError.error.ValidationErrors.length>0) {
      //   for (let i = 0; i <responseError.error.ValidationErrors.length; i++) {
      //     this.toastrService.error(responseError.error.ValidationErrors[i].ErrorMessage)
      //     console.log(  responseError.error.ValidationErrors[i].ErrorMessage);
      //   }
      // }
    })

    
  }

  validateDate(rentDate:string,returnDate:string){
    if (rentDate!=null && returnDate!=null) {

      const rent = new Date(rentDate);
      const returnD = new Date(returnDate);

      if (rentDate>=returnDate) {
        this.validateRentalDates = false;
        //this.resetDate()
      }
      else{
        this.validateRentalDates = true;
        
      
    }
  }
  
  
  }

  convertStringToDate(dateString: string): Date | null {
    if (!dateString) return null;
    return new Date(dateString);
  }


  calculateRentalDays(rentDate: string, returnDate: string): number {
    if (!rentDate || !returnDate) return 0;

    const startDate = new Date(rentDate);
    const endDate = new Date(returnDate);

    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays > 0 ? differenceInDays : 0;
  }
  
  calculateRentalPeriod() {
    this.rentalPeriod = this.calculateRentalDays(this.rentalStartDate, this.rentalEndDate);
  }
 

  resetDate(){
    this.rentalStartDate=null
    this.rentalEndDate=null
    this.validateRentalDates = false;
    this.rentalPeriod = 0;
  }


  getImagePath(imagePath: string) {
    
    return this.carImageService.getImagePath(imagePath)
  }

  getCarsOfCurrentBrand() {
    this.carService.getCarsByBrandId(this.currentCar.brandId).subscribe((response) => {
      this.carsOfCurrentBrand = response.data;
      console.log(this.carsOfCurrentBrand);
      //Markaya ait diğer araçlar listesinden, mevcut arabayı çıkartıyorum. Mevcut arabayı zaten görüntülüyor.
      let index: number = -1;
      for (let i = 0; i < this.carsOfCurrentBrand.length; i++) {
        if (this.carsOfCurrentBrand[i].carId == this.currentCar.carId) {
          index = i;
        }
      }
      this.carsOfCurrentBrand.splice(index, 1);
    });
  }

}
