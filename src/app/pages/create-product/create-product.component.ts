import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CProduct, ICategory } from '../../core/model/Models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit{

  product: CProduct = new CProduct();
  selectedFile: File | null = null;
  imgSrc: string = '';
  categoryList: ICategory[] = [];

  constructor(private productService: ProductService,
     private http: HttpClient,
      private router: Router) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.productService.getAllCategory().subscribe((categories)=>{
      this.categoryList = categories;
    })
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
  
      this.http.post<{ imagePath: string }>('http://localhost:3000/upload', formData).subscribe(
        response => {
          this.imgSrc = response.imagePath;
          this.createProduct(); // Llama a createProduct después de cargar el archivo
          this.router.navigate(['./admin-product']);  
        },
        error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
        }
      );
    } else {
      this.createProduct();
      this.router.navigate(['./admin-product']);
    }
  }

  createProduct() {
    if (this.imgSrc) {
      this.product.imgSrc = this.imgSrc;
    }
    this.productService.createProduct(this.product).subscribe(
      res => {
        alert('Producto creado con éxito');
      },
      error => {
        console.error('Error creating product:', error);
        alert('Error creating product');
      }
    );
  }
}
