import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/entites/car';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-delete',
  standalone: false,
  templateUrl: './car-delete.component.html',
  styleUrl: './car-delete.component.css'
})
export class CarDeleteComponent implements OnInit {
  

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { deletedCar: Car },
      private dialogRef: MatDialogRef<CarDeleteComponent>,
      private carService: CarService,
      private carImageService: CarImageService,
      private toastrService: ToastrService
    ) {
    }
  
    ngOnInit(): void {
      console.log(this.data.deletedCar);
    }
  
    delete(deleteCar: Car) {
      
      this.carService.deleteCar(deleteCar).subscribe(response => {
        console.log(this.data.deletedCar);
        this.toastrService.success(response.message, "Başarılı");
        this.dialogRef.close(true);
      }, responseError => {
        console.log(responseError);
        this.toastrService.error(responseError.error.Message, "Hata");
      });
    }
  
    closeModal() {
      this.dialogRef.close(false);
    }


    getImagePath(imagePath: string) { // !!!!!!!!!!!!!!!!
      return this.carImageService.getImagePath(imagePath);
    }
}
