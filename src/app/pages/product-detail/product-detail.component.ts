import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../core/model/Models';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CartItemCountService } from '../../core/services/cart-item-count.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [    
    CommonModule, RouterOutlet
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: IProduct | undefined;
  userId!: number;
  cartItemCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cartItemCountService: CartItemCountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const loggedUserData = JSON.parse(userData);
      this.userId = loggedUserData.id;
    } 

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const productId = Number(id); 
        this.getProductDetails(productId);
      }
    });
  }

  getProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe(
      (product: IProduct) => {
        this.product = product;
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  addToCart(productId: number): void {
    if (this.userId) {
      this.cartService.addToCart(this.userId, productId).subscribe(
        () => {
          console.log('Product added to cart successfully:');
          // Obtener el número actual de productos en el carrito después de agregar uno nuevo
          this.cartService.getCartItemCount().subscribe(
            (response: any) => {
              this.cartItemCount = response.totalProducts;
              // Actualizar el servicio de conteo de productos en el carrito
              this.cartItemCountService.updateCartItemCount(this.cartItemCount);
            },
            (error) => {
              console.error('Error getting total products in cart:', error);
            }
          );
        },
        (error) => {
          console.error('Error adding product to cart:', error);
        }
      );
    } else {
      alert("Inicia sesion para agregar productos al carrito")
    }
  }
}
