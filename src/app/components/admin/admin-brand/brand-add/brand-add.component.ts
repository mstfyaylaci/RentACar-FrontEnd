import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from 'src/app/services/brand.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-brand-add',
  standalone: false,
  templateUrl: './brand-add.component.html',
  styleUrl: './brand-add.component.css'
})
export class BrandAddComponent implements OnInit{

  brandAddForm:FormGroup

  constructor(
    private brandService: BrandService,
    private formBuilder:FormBuilder,
    private toastrService:ToastrService,
    private errorService:ErrorService,
    private brandAddModal: MatDialogRef<BrandAddComponent>,
  ) {
    
    
  }
  ngOnInit(): void {
    this.createAddForm();
  }

  createAddForm(){
    this.brandAddForm = this.formBuilder.group({
      brandName: ["",Validators.required],
    })
  }

  add(){
    if (this.brandAddForm.valid) {
      let brandModel= Object.assign({},this.brandAddForm.value)  
    this.brandService.addBrand(brandModel).subscribe(response=>{
      this.toastrService.success(response.message,"Başarılı")
      this.brandAddModal.close(true);
    },responseError=>{

      this.errorService.backendError(responseError,"Marka eklenemedi")
      
    })
    }
    else{
      this.toastrService.error("Form eksik")
      this.brandAddForm.reset();
    }
  }

  

  closeBrandAddModal(){
     this.brandAddModal.close();

  }
}
