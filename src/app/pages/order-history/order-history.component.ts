import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';
import { CartItemCountService } from '../../core/services/cart-item-count.service';
import { ProductService } from '../../core/services/product.service';
import { Order, OrderItem, IProduct } from '../../core/model/Models';
import { Observable, forkJoin } from 'rxjs';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } // Configura Angular para usar español solo en este componente
  ]
})

export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  userId!: number;
  cartItemCount: number = 0;
  admin: boolean = false;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private cartItemCountService: CartItemCountService,
    private productService: ProductService // Inyecta ProductService en el constructor
  ) {
    this.orders = [];
  }

  ngOnInit(): void {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const loggedUserData = JSON.parse(userData);
      this.userId = loggedUserData.id;
      if (loggedUserData.admin == true) {
        console.log('User is admin');
        this.loadAllOrders();
      } else {
        console.log('User is not admin');
        this.loadOrders();
      }
    }
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
    
  }

  loadOrders(): void {
    console.log('Loading orders for user:', this.userId);
    this.orderService.getOrdersByUserId(this.userId).subscribe(orders => {
      console.log('Orders:', orders);
      this.orders = orders;
      this.loadProductsInfo();
    });
  }

  loadAllOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      this.loadProductsInfo();
    });
  }

  loadProductsInfo(): void {
    const observables: Observable<IProduct>[] = [];
    
    if (Array.isArray(this.orders)) {
      this.orders.forEach(order => {
        order.items.forEach((item: OrderItem) => {
          observables.push(this.productService.getProductById(item.productId));
        });
      });
    }
    
    forkJoin(observables).subscribe((products: IProduct[]) => {
      let index = 0;
      if (Array.isArray(this.orders)) {
        this.orders.forEach(order => {
          order.items.forEach((item: OrderItem) => {
            item.productInfo = products[index];
            index++;
          });
          order.totalPrice = this.calculateTotalPrice(order.items);
        });
      }
    });
  }

  calculateTotalPrice(items: OrderItem[]): number {
    return items.reduce((total, item) => total + (item.productInfo?.precio || 0) * item.quantity, 0);
  }
}
