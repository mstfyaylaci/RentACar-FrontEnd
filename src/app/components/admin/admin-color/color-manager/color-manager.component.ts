import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Color } from 'src/app/models/entites/color';
import { ColorService } from 'src/app/services/color.service';
import { ColorAddComponent } from '../color-add/color-add.component';
import { ColorUpdateComponent } from '../color-update/color-update.component';
import { ColorDeleteComponent } from '../color-delete/color-delete.component';

@Component({
  selector: 'app-color-manager',
  standalone: false,
  templateUrl: './color-manager.component.html',
  styleUrl: './color-manager.component.css'
})
export class ColorManagerComponent {

    colors: Color[];
    colorsDataLoaded: boolean = false;
    /**
     *
     */
    constructor(
      private colorService:ColorService,
      private dialog: MatDialog,
    ) {
      
    }
    ngOnInit(): void {
     this.getColors()
    }
  
  
    getColors() {
      this.colorService.getColors().subscribe((response) => {
        this.colors = response.data
        this.colorsDataLoaded=true
        
      });
    }
  
    openColorAddModal() {
      const dialogRef = this.dialog.open(ColorAddComponent, {
        disableClose: true,
        width: "25%"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getColors(); // Refresh the brand list after adding a new brand
        }
      });
    }
  
    openColorUpdateModal(color:Color){
      const dialogRef = this.dialog.open(ColorUpdateComponent, {
        disableClose: true,
        width: "40%",
        data: { updateColor: color }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getColors(); // Refresh the brand list after adding a new brand
        }
      });
    }
  
    openColorDeleteModal(color:Color){
      const dialogRef = this.dialog.open(ColorDeleteComponent, {
        disableClose: true,
        width: "25%",
        data: { deletedColor: color }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getColors(); // Refresh the brand list after deleting a brand
        }
      });
    }
}
