import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entites/brand';
import { Car } from 'src/app/models/entites/car';
import { CarImage } from 'src/app/models/entites/carImage';
import { Color } from 'src/app/models/entites/color';
import { UploadFile } from 'src/app/models/entites/uploadFile';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-car-update',
  standalone: false,
  templateUrl: './car-update.component.html',
  styleUrl: './car-update.component.css'
})
export class CarUpdateComponent implements OnInit {


  carUpdateForm: FormGroup


  brands: Brand[];
  colors: Color[];
  years: number[] = [];

  brandsDataLoaded: boolean = false;
  colorsDataLoaded: boolean = false;

  carImages: CarImage[] = []
  uploadImagesPaths: any[] = []
  updateCarImagesFiles: UploadFile[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { updatedCar: Car },
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private carImageService: CarImageService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private carUpdateModal: MatDialogRef<CarUpdateComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data.updatedCar);
    this.createAddForm();
    this.getBrands();
    this.getColors();
    this.generateYears();

  }

  createAddForm() {
      this.carUpdateForm = this.formBuilder.group({
        id: [this.data.updatedCar.id, Validators.required],
        brandId: [this.data.updatedCar.brandId, Validators.required],
        colorId: [this.data.updatedCar.colorId, Validators.required],
        carName: [this.data.updatedCar.carName, Validators.required],
        modelYear: [this.data.updatedCar.modelYear, Validators.required],
        dailyPrice: [this.data.updatedCar.dailyPrice, Validators.required],
        description: [this.data.updatedCar.description, Validators.required],
        
  
      })
    }
  

  update() {

  }




  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
      this.years.push(year);
    }
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data
      this.brandsDataLoaded = true

    });
  }
  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data
      this.colorsDataLoaded = true
    })
  }

  getImagePath(imagePath: string) { // !!!!!!!!!!!!!!!!
    return this.carImageService.getImagePath(imagePath);
  }


  closeCarUpdateModal() {
    this.carUpdateModal.close();

  }
}
