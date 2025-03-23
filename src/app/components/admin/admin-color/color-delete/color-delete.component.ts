import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/entites/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-delete',
  standalone: false,
  templateUrl: './color-delete.component.html',
  styleUrl: './color-delete.component.css'
})
export class ColorDeleteComponent implements OnInit {
  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { deletedColor: Color },
    private dialogRef: MatDialogRef<ColorDeleteComponent>,
    private colorService: ColorService,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  delete() {
    this.colorService.deleteColor(this.data.deletedColor).subscribe(response => {
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
