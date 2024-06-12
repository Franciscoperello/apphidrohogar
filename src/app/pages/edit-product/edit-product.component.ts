import { Component, OnInit } from '@angular/core';
import { ICategory, IProduct } from '../../core/model/Models';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  product: IProduct | undefined = undefined;
  id!: number;
  selectedFile: File | null = null;
  imgSrc: string = '';
  categoryList: ICategory[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.id).subscribe((product) => {
      this.product = product;
      if (this.product && this.product.imgSrc) {
        this.imgSrc = this.product.imgSrc;
      }
    });

    this.productService.getAllCategory().subscribe((categories)=>{
      this.categoryList = categories;
    })

  }

  updateProduct(): void {
    if (this.product) {
      this.product.imgSrc = this.imgSrc;
      console.log("Has puesto la imagen, " + this.imgSrc);
      this.productService.updateProduct(this.id, this.product).subscribe((res : any) => {
        this.router.navigate(['/admin-product']);
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
  
      this.http.post<{ imagePath: string }>('http://localhost:3000/upload', formData).subscribe(
        response => {
          console.log(this.imgSrc);
          console.log("La imagen pasa por aquí, post")
          this.imgSrc = response.imagePath;
          this.updateProduct(); // Llama a createProduct después de cargar el archivo
          this.router.navigate(['./admin-product']);  
        },
        error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
        }
      );
    } else {
      this.updateProduct();
      this.router.navigate(['./admin-product']);
    }
  }
}
