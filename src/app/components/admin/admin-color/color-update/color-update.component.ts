import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/entites/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-update',
  standalone: false,
  templateUrl: './color-update.component.html',
  styleUrl: './color-update.component.css'
})
export class ColorUpdateComponent {

  colorUpdateForm:FormGroup
  
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { updateColor: Color },
        private dialogRef: MatDialogRef<ColorUpdateComponent>,
         private formBuilder:FormBuilder,
        private colorService: ColorService,
        private toastrService: ToastrService
      ) {
      }
  
    ngOnInit(): void {
      this.createUpdateForm();
    }
  
    createUpdateForm(){
        this.colorUpdateForm = this.formBuilder.group({
          id: [this.data.updateColor.id,Validators.required],
          colorName: [this.data.updateColor.colorName,Validators.required],
        })
      }
  
    update() {
      if (this.colorUpdateForm.valid) {
        let colorModel= Object.assign({},this.colorUpdateForm.value) 
        this.colorService.updateColor(colorModel).subscribe(response => {
        this.toastrService.success(response.message, "Başarılı");
        this.dialogRef.close(true);
      }, error => {
        this.toastrService.error("Güncelleme işlemi başarısız", "Hata");
      });
      }
      
    }
  
    closeModal() {
      this.dialogRef.close(false);
    }
}
