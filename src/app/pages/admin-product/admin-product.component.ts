import { Component, OnInit  } from '@angular/core';
import { ProductService } from '../../core/services/product.service'; 
import { IProduct } from '../../core/model/Models';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent implements OnInit {
  productList: IProduct [] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {
    this.productService.getAllProduct().subscribe((res: any)=>{
      this.productList =  res;
    },error=> {
      alert("Error From API")
    })
  }
}