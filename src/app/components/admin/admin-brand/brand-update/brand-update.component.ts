import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entites/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-update',
  standalone: false,
  templateUrl: './brand-update.component.html',
  styleUrl: './brand-update.component.css'
})
export class BrandUpdateComponent implements OnInit {

  brandUpdateForm:FormGroup

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { updateBrand: Brand },
      private dialogRef: MatDialogRef<BrandUpdateComponent>,
       private formBuilder:FormBuilder,
      private brandService: BrandService,
      private toastrService: ToastrService
    ) {
    }

  ngOnInit(): void {
    this.createUpdateForm();
  }

  createUpdateForm(){
      this.brandUpdateForm = this.formBuilder.group({
        id: [this.data.updateBrand.id,Validators.required],
        brandName: [this.data.updateBrand.brandName,Validators.required],
      })
    }

  update() {
    if (this.brandUpdateForm.valid) {
      let brandModel= Object.assign({},this.brandUpdateForm.value) 
      this.brandService.updateBrand(brandModel).subscribe(response => {
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
