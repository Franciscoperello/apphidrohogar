import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../core/services/cart.service'; 
import { Cart, IProduct, CartItem } from '../../core/model/Models'; 
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { CartItemCountService } from '../../core/services/cart-item-count.service';
import { interval, Observable, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [  
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | undefined;
  products: { product: IProduct, quantity: number }[] = [];
  userId!: number;
  private subscription: Subscription = new Subscription();

  constructor(private cartService: CartService, private productService: ProductService, private cartItemCountService: CartItemCountService, private router: Router) { }

  ngOnInit(): void {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const loggedUserData = JSON.parse(userData);
      this.userId = loggedUserData.id;
      this.loadCart().subscribe(cart => this.updateCartProducts(cart));
    }
  }

  loadCart(): Observable<Cart> {
    this.cartService.getCartItemCount().subscribe((response: any) => {
      const totalProducts = response.totalProducts;
      this.cartItemCountService.updateCartItemCount(totalProducts);
    });
    return this.cartService.getCartByUserId(this.userId);
  }

  updateCartProducts(cart: Cart): void {
    this.cart = cart;
    this.products = [];
    if (this.cart && this.cart.items) {
      this.cart.items.forEach((item: CartItem) => {
        this.productService.getProductById(item.productId).subscribe((product: IProduct) => {
          this.products.push({ product, quantity: item.quantity });
        });
      });
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que deseas eliminar todos los productos del carrito?')) {
      this.cartService.deleteCart().subscribe(
        () => {
          this.cart = undefined;
          this.products = [];
          this.cartItemCountService.updateCartItemCount(0);
        },
        (error) => {
          console.error('Error al eliminar el carrito:', error);
        }
      );
    }
  }
  
  increaseQuantity(productId: number): void {
    this.cartService.increaseProductQuantity(this.userId, productId).subscribe(
      () => this.loadCart().subscribe(cart => this.updateCartProducts(cart)),
      (error) => console.error('Error increasing product quantity:', error)
    );
  }

  async decreaseQuantity(productId: number): Promise<void> {
    this.cartService.decreaseProductQuantity(this.userId, productId).subscribe(
      () => this.loadCart().subscribe(cart => this.updateCartProducts(cart)),
      (error) => console.error('Error decreasing product quantity:', error)
    );
  }

  removeProduct(productId: number): void {
    location.reload();
    this.cartService.removeProductFromCart(this.userId, productId).subscribe(
      () => this.loadCart().subscribe(cart => this.updateCartProducts(cart)),
      (error) => console.error('Error removing product from cart:', error)
    );
  }

  getTotalCost(): number {
    return this.products.reduce((total, item) => {
      const price = item.product.precioOferta ? item.product.precioOferta : item.product.precio;
      return total + price * item.quantity;
    }, 0);
  }
}