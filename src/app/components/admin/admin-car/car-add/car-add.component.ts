import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/entites/brand';
import { Car } from 'src/app/models/entites/car';
import { Color } from 'src/app/models/entites/color';
import { UploadFile } from 'src/app/models/entites/uploadFile';
import { BrandService } from 'src/app/services/brand.service';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-car-add',
  standalone: false,
  templateUrl: './car-add.component.html',
  styleUrl: './car-add.component.css'
})
export class CarAddComponent implements OnInit {

  carAddForm: FormGroup
  brands: Brand[];
  colors: Color[];
  years: number[] = [];

  carImagesPaths: any[] = []
  carImagesFiles: UploadFile[] = [];


 

  brandsDataLoaded: boolean = false;
  colorsDataLoaded: boolean = false;
  /**
  *  
  */

  constructor(
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private carImageService: CarImageService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private carAddModal: MatDialogRef<CarAddComponent>,
  ) {

  }
  ngOnInit(): void {
    this.createAddForm();
    this.getBrands();
    this.getColors();
    this.generateYears();
  }


  createAddForm() {
    this.carAddForm = this.formBuilder.group({
      brandId: ["", Validators.required],
      colorId: ["", Validators.required],
      carName: ["", Validators.required],
      modelYear: ["", Validators.required],
      dailyPrice: ["", Validators.required],
      description: ["", Validators.required],
      

    })
  }

 

  add() {
    if (this.carAddForm.valid) {
      let carModel = Object.assign({}, this.carAddForm.value)

      
      this.carService.addCar(carModel).subscribe(response => {
        
        if (this.carImagesFiles.length === 0) {
          this.toastrService.success("Yeni araç başarıyla eklendi", "İşlem başarılı");
          this.closeCarAddModal();
        }
        else {
          if (this.carImagesFiles.length > 5) {
            this.toastrService.error("En fazla 5 resim yükleyebilirsiniz", "Araç eklenmedi");
          }
          else {
            let carId = response.data
            this.uploadAllImagesToServer(this.carImagesFiles, carId).then((unUploadFileList) => {
              let unUploadedFiles: UploadFile[] = unUploadFileList;
              if (unUploadedFiles.length === 0) {
                this.toastrService.success("Yeni araç ve resimleri başarıyla eklendi", "İşlem başarılı");
                this.closeCarAddModal();
              }
              else {
                let failFileNameMessage: string = ""
                unUploadedFiles.forEach(file => {
                  failFileNameMessage += file.file.name + ", "
                });
                this.toastrService.warning("Yeni araç başarıyla eklendi fakat bazı resimler yüklenemedi. Yüklenemeyen dosyalar: " + failFileNameMessage, "İşlem kısmen başarılı");
                this.closeCarAddModal();
                
              }
            })
          }
        }

      }, responseError => {
        
        this.errorService.backendError(responseError, "Araç eklenemedi")

      })
    }
    else {
      this.toastrService.error("Form eksik")
      this.carAddForm.reset();
    }
  }

  private uploadAllImagesToServer(uploadFiles: UploadFile[], carId: number): Promise<UploadFile[]> {
    return new Promise<UploadFile[]>((methodResolve) => {
      if (uploadFiles.length > 0) {
        let unUploadedFiles: UploadFile[] = []
        const allUploads = new Promise<void>(async (resolveAllUploads) => {
          let counter: number = 0;
          for (const file of uploadFiles) {
            await this.uploadImageToServer(file, carId).then(fileStatus => {
              if (fileStatus.uploadStatus === false) {
                unUploadedFiles.push(fileStatus);
              }
            }).then(() => {
              counter += 1;
              if (counter === uploadFiles.length) {
                resolveAllUploads();
              }
            })
          }
        })
        allUploads.then(() => {
          methodResolve(unUploadedFiles);
        })
      } else {
        let emptyArray: UploadFile[] = [];
        methodResolve(emptyArray);
      }
    })
  }

  private uploadImageToServer(uploadFile: UploadFile, carId: number): Promise<UploadFile> {
    return new Promise<UploadFile>((result) => {
      this.carImageService.uploadCarImage(uploadFile.file, carId).subscribe((uploadSuccess) => {
        uploadFile.uploadStatus = true;
        result(uploadFile);
      }, (uploadFail) => {
        uploadFile.uploadStatus = false;
        result(uploadFile);
      })
    })
  }

  addCarImages(imageList: any) {
    // Kullanıcının eklediği resim sayısı 5'ten az mı kontrol ediliyor.
    
    if (this.carImagesFiles.length < 5) {

      // Kullanıcının yüklemek istediği resimlerin her biri için döngü başlatılıyor.
      for (let i = 0; i < imageList.length; i++) {
        let uploadFile = new UploadFile(); // Yeni bir UploadFile nesnesi oluşturuluyor.
        let image = imageList[i]; // Listeden tek tek resimler alınıyor.
        uploadFile.file = image; // Seçilen resim UploadFile nesnesine atanıyor.
        uploadFile.uploadStatus = false; // Yükleme başlangıçta başarısız olarak işaretleniyor.

        // Daha önce aynı isimde bir resim yüklenmiş mi kontrol ediliyor.
        let preselectedFile = this.carImagesFiles.find(uploadFile => uploadFile.file.name === image.name);

        // Eğer resim daha önce yüklenmemişse işlemler devam ediyor.
        if (preselectedFile === undefined) {

          // Resmin geçerli olup olmadığını kontrol eden fonksiyon çağrılıyor.
          this.addCarImageToCarImagesPaths(image).then((success) => {
            if (success) {
              // Eğer resim geçerli ve başarılı şekilde işlendi ise listeye ekleniyor.
              this.carImagesFiles.push(uploadFile);
            }
          });

        } else {
          // Eğer resim zaten listeye eklenmişse kullanıcıya uyarı veriliyor.
          this.toastrService.warning("Bu resmi daha önce listeye eklediniz", "Zaten listede");
        }
      }
      

    } else {
      // Eğer kullanıcı 5'ten fazla resim yüklemeye çalışırsa hata mesajı gösteriliyor.
      this.toastrService.error("En fazla 5 resim ekleyebilirsiniz", "Resim eklenemiyor");
    }
  }

  private addCarImageToCarImagesPaths(image: any): Promise<boolean> {
    return new Promise<boolean>((result) => {

      // Dosyanın resim olup olmadığı kontrol ediliyor.
      this.checkFileMimeType(image).then((successStatus) => {

        if (successStatus) {
          var reader = new FileReader(); // Dosya okuma işlemi için FileReader nesnesi oluşturuluyor.
          reader.readAsDataURL(image); // Dosya base64 formatına çevriliyor.

          reader.onload = (_event) => {
            // Dosya başarılı şekilde okunduğunda base64 formatında saklanıyor.
            this.carImagesPaths.push(reader.result);
            result(true); // İşlem başarılı olarak işaretleniyor.
          }
        } else {
          // Eğer dosya bir resim değilse hata mesajı gösteriliyor.
          this.toastrService.error("Yalnızca resim dosyası yükleyebilirsiniz", "Dosya eklenmedi");
          result(false); // İşlem başarısız olarak işaretleniyor.
        }
      });
    });
  }

  private checkFileMimeType(file: any): Promise<boolean> {
    return new Promise<boolean>((methodResolve) => {
      var mimeType = file.type;
      methodResolve(mimeType.match(/image\/*/) != null);
    })
  }

  deleteImageFromCarImagesList(selectedImage: UploadFile) {
    this.carImagesFiles.splice(this.carImagesFiles.indexOf(selectedImage), 1);
    this.carImagesPaths.splice(this.carImagesPaths.indexOf(selectedImage), 1);
  }


  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
      this.years.push(year);
    }
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data
      this.brandsDataLoaded = true

    });
  }
  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data
      this.colorsDataLoaded = true
    })
  }



  closeCarAddModal() {
    this.carAddModal.close();

  }

}
