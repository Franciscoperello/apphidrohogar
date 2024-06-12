import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ICategory, IProduct } from '../../core/model/Models';
import { Observable } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [    
    HttpClientModule, 
    CommonModule,
    AsyncPipe,
    FormsModule,
    RouterModule 
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  productList: IProduct [] = [];
  originalProductList: IProduct[] = [];
  currentCategory: string | null = null;

  categoryList$: Observable<ICategory[]> | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProduct();
    this.categoryList$ = this.productService.getAllCategory();
  }

  getProductByCategory(cateName: string){
    this.resetFilter();
    this.currentCategory = cateName;
    this.productService.getAllProductsByCategory(cateName).subscribe((res: any)=>{
      this.productList = res;
      this.originalProductList = [...this.productList];
    })
  }

  getAllProduct() {
    this.resetFilter();
    this.currentCategory = null;
    this.productService.getAllProduct().subscribe((res: any)=>{
      this.productList =  res;
      this.originalProductList = [...this.productList];
    },error=> {
      alert("Error From API")
    })
  }

  onFilterChange(event: any) {
    const filterValue = event.target.value;
    if (filterValue === 'alto') {
      this.productList = [...this.originalProductList];
      this.productList.sort((a, b) => {
        const priceA = a.precioOferta && a.precioOferta > 0 ? a.precioOferta : a.precio;
        const priceB = b.precioOferta && b.precioOferta > 0 ? b.precioOferta : b.precio;
        return priceB - priceA;
      });
    } else if (filterValue === 'bajo') {
      this.productList = [...this.originalProductList];
      this.productList.sort((a, b) => {
        const priceA = a.precioOferta && a.precioOferta > 0 ? a.precioOferta : a.precio;
        const priceB = b.precioOferta && b.precioOferta > 0 ? b.precioOferta : b.precio;
        return priceA - priceB;
      });
    } else if (filterValue === 'oferta') {
      this.productList = this.originalProductList.filter(item => item.precioOferta && item.precioOferta > 0 && (!this.currentCategory || item.categoria === this.currentCategory));
    } else {
      // Restaurar la lista original si no se selecciona un filtro válido
      this.productList = [...this.originalProductList];
    }
  }

  resetFilter() {
    const selectElement = document.getElementById('filtrar') as HTMLSelectElement;
    selectElement.value = '';
  }
}

