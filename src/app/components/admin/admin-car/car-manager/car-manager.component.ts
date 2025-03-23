import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/entites/car';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { CarAddComponent } from '../car-add/car-add.component';
import { CarUpdateComponent } from '../car-update/car-update.component';
import { CarDeleteComponent } from '../car-delete/car-delete.component';

@Component({
  selector: 'app-car-manager',
  standalone: false,
  templateUrl: './car-manager.component.html',
  styleUrl: './car-manager.component.css'
})
export class CarManagerComponent implements OnInit {

  cars: Car[] = [];
  carsDataLoaded: boolean = false;

  constructor(
    private carService: CarService,
    private carImageService: CarImageService,
    private dialog: MatDialog,


  ) { }

  ngOnInit(): void {
    this.getCars()
    
  }

  getCars() {
    this.carService.getCars().subscribe((response) => {
      this.cars = response.data
      this.carsDataLoaded = true;
     
    })
  }

  openCarAddModal() {
    const dialogRef = this.dialog.open(CarAddComponent, {
      disableClose: true,
      width: "65%"
      
    });

    dialogRef.afterClosed().subscribe(result => {
      
        this.getCars(); 
      
    });
  }
  openCarUpdateModal(car: Car) {
    const dialogRef = this.dialog.open(CarUpdateComponent, {
      disableClose: true,
      width: "25%",
      data: { updateCar: car }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCars(); 
      }
    });
  }
  openCarDeleteModal(car: Car) {
    
    const dialogRef = this.dialog.open(CarDeleteComponent, {
      disableClose: true,
      width: "50%",
      data: { deletedCar: car }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCars(); 
      }
    });
  }

  getImagePath(imagePath: string) { // !!!!!!!!!!!!!!!!
    return this.carImageService.getImagePath(imagePath);
  }

}
