import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent {
  name: string = '';
  address: string = '';
  phone: string = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  async placeOrder(): Promise<void> {
    const userData = sessionStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData).id : null;
    if (userId) {
      this.cartService.getCartByUserId(userId).subscribe(cart => {
        const orderData = {
          userId: userId,
          name: this.name,
          address: this.address,
          phone: this.phone,
          items: cart.items
        };

        this.orderService.createOrder(orderData).subscribe(() => {
          this.cartService.deleteCart().subscribe(() => {
            this.router.navigate(['/order-history']);
          });
        });
      });
    }
  }
}
