import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ColorService } from 'src/app/services/color.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-color-add',
  standalone: false,
  templateUrl: './color-add.component.html',
  styleUrl: './color-add.component.css'
})
export class ColorAddComponent implements OnInit {

  colorAddForm:FormGroup
  
    constructor(
    private colorService:ColorService,
    private formBuilder:FormBuilder,
    private toastrService:ToastrService,
    private errorService:ErrorService,
    private colorAddModal: MatDialogRef<ColorAddComponent>,
    ) {
      
      
    }
    ngOnInit(): void {
      this.createAddForm();
    }
  
    createAddForm(){
      this.colorAddForm = this.formBuilder.group({
        colorName: ["",Validators.required],
      })
    }
  
    add(){
      if (this.colorAddForm.valid) {
        let colorModel= Object.assign({},this.colorAddForm.value)  
      this.colorService.addColor(colorModel).subscribe(response=>{
        console.log(colorModel);
        this.toastrService.success(response.message,"Başarılı")
        this.colorAddModal.close(true);
      },responseError=>{
  
        this.errorService.backendError(responseError,"Marka eklenemedi")
        
      })
      }
      else{
        this.toastrService.error("Form eksik")
        this.colorAddForm.reset();
      }
    }
  
    
  
    closeColorAddModal(){
       this.colorAddModal.close();
  
    }
}
