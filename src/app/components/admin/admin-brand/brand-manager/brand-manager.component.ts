import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Brand } from 'src/app/models/entites/brand';
import { BrandService } from 'src/app/services/brand.service';
import { BrandAddComponent } from '../brand-add/brand-add.component';
import { BrandUpdateComponent } from '../brand-update/brand-update.component';
import { BrandDeleteComponent } from '../brand-delete/brand-delete.component';

@Component({
  selector: 'app-brand-manager',
  standalone: false,
  templateUrl: './brand-manager.component.html',
  styleUrl: './brand-manager.component.css'
})
export class BrandManagerComponent implements OnInit{

  brands: Brand[];
  brandsDataLoaded: boolean = false;
  /**
   *
   */
  constructor(
    private brandService:BrandService,
    private dialog: MatDialog,
  ) {
    
  }
  ngOnInit(): void {
   this.getBrands()
  }


  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data
      this.brandsDataLoaded=true
      
    });
  }

  openBrandAddModal() {
    const dialogRef = this.dialog.open(BrandAddComponent, {
      disableClose: true,
      width: "25%"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBrands(); // Refresh the brand list after adding a new brand
      }
    });
  }

  openBrandUpdateModal(brand:Brand){
    const dialogRef = this.dialog.open(BrandUpdateComponent, {
      disableClose: true,
      width: "40%",
      data: { updateBrand: brand }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBrands(); // Refresh the brand list after adding a new brand
      }
    });
  }

  openBrandDeleteModal(brand:Brand){
    const dialogRef = this.dialog.open(BrandDeleteComponent, {
      disableClose: true,
      width: "25%",
      data: { deletedBrand: brand }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBrands(); // Refresh the brand list after deleting a brand
      }
    });
  }
}
