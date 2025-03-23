import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entites/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-delete',
  standalone: false,
  templateUrl: './brand-delete.component.html',
  styleUrl: './brand-delete.component.css'
})
export class BrandDeleteComponent implements OnInit {
  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { deletedBrand: Brand },
    private dialogRef: MatDialogRef<BrandDeleteComponent>,
    private brandService: BrandService,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
  }


  delete() {
    this.brandService.deleteBrand(this.data.deletedBrand).subscribe(response => {
      this.toastrService.success(response.message, "Başarılı");
      this.dialogRef.close(true);
    }, error => {
      this.toastrService.error("Silme işlemi başarısız", "Hata");
    });
  }

  closeModal() {
    this.dialogRef.close(false);
  }
}
