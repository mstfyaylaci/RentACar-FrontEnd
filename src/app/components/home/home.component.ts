import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entites/brand';
import { Car } from 'src/app/models/entites/car';
import { Color } from 'src/app/models/entites/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  cars: Car[] = [];
  brands: Brand[];
  colors: Color[];

  filterBrandId: number = 0;
  filterColorId: number = 0;
  filterCarModelName: string = "";
  filterText:string=""

  carsDataLoaded: boolean=false
  brandsDataLoaded: boolean = false;
  colorsDataLoaded: boolean = false;

  maxRandomCarLength: number = 5;
  randomCars: Car[] = [];

  routerLink: string = "";
  
  imageOfPath=""
  /**
   *
   */
  constructor(  
    private carService: CarService,
    private activatedRoute: ActivatedRoute,
    private carImageService: CarImageService,
    private brandService: BrandService,
    private colorService: ColorService,
    private toastrService:ToastrService,
    private router: Router) {
    
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['brandId'] && params['colorId']) {
        this.getCarsByBrandAndColor(params['brandId'], params['colorId']);
      } else if (params['brandId']) {
        this.getCarsByBrandId(params['brandId']);
      } else if (params['colorId']) {
        this.getCarsByColorId(params['colorId']);
      } else {
        this.getCars();
      }
        this.getBrands()
        this.getColors()
    })

  }

  getCars() {
    this.carService.getCars().subscribe((response) => {
      this.cars = response.data
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true;

    })
  }

  getCarsByBrandId(brandId: Number) {
    this.carService.getCarsByBrandId(brandId).subscribe((response) => {
      this.cars = response.data
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true
    })
  }

  getCarsByColorId(colorId: Number) {
    this.carService.getCarsByColorId(colorId).subscribe((response) => {
      this.cars = response.data
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true
    })
  }

  getCarsByBrandAndColor(brandId: number, colorId: Number) {
    this.carService.getCarsByBrandAndColor(brandId, colorId).subscribe((response) => {
      this.cars = response.data
      this.getRandomCars(this.cars, this.maxRandomCarLength);
      this.carsDataLoaded = true
    })

  }

  getCarImageByCarId(carId: number) {
    this.carImageService.getCarImagesByCar(carId).subscribe(response => {
      
      const imagePath = response.data[2].imagePath
      const date=response.data[2].dateTime
      this.imageOfPath =this.getImagePath(imagePath)
      
    })
    
  }

  getImagePath(imagePath: string) { // !!!!!!!!!!!!!!!!
    return this.carImageService.getImagePath(imagePath);
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data
      this.brandsDataLoaded=true
      
    });
  }
  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data
      this.colorsDataLoaded=true
    })
  }


  

  filterCars() {
    

    if (this.filterBrandId !== 0 && this.filterColorId !== 0) {
      this.router.navigate(['/brand', this.filterBrandId, 'color', this.filterColorId]);
    } else if (this.filterBrandId !== 0) {
      this.router.navigate(['/brand', this.filterBrandId]);
    } else if (this.filterColorId !== 0) {
      this.router.navigate(['/color', this.filterColorId]);
    } else {
      this.getCars();
    }
  }

  filterSearchCars(){
    this.filterCarModelName=this.filterText
  }

  resetFilters(){
    this.filterBrandId=0;
    this.filterColorId=0
    this.getCars();
    
  }


  getRandomCars(carList: Car[], number: number) {// !!!!!!!!!!!!!!!!
    let tempCarList: Car[] = [];
    carList.forEach(car => {
      tempCarList.push(car);
    });

    
    this.randomCars = [];
    if (number > tempCarList.length) {
      
      number = tempCarList.length;
    }
    for (let i = 0; i < number; i++) {
      let randomNumber = this.getRandomNumber(tempCarList.length);
      //console.log(tempCarList[10]);
      let  randomCar = tempCarList[randomNumber]
      //console.log(randomCar.carImages[0].imagePath);
      if (randomCar.carImages[0].imagePath != "Uploads/Images/Default.png") {
        this.randomCars.push(randomCar)
      }
      tempCarList.splice(randomNumber, 1);
    }
    console.log(this.randomCars);
  }

  private getRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }
}
