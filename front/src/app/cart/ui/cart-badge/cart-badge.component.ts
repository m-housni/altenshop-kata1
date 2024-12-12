import { Component, inject, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CartService } from '../../data-access/cart.service';

@Component({
  selector: 'app-cart-badge',
  templateUrl: './cart-badge.component.html',
  styleUrls: ['./cart-badge.component.scss']
})
export class CartBadgeComponent {
  @Output() cart = new Map();
  @Output() productsCount: number = 0;

  private readonly cartService = inject(CartService);

  constructor() {
    this.cartService.getUniqueProductCount().subscribe(count => {
      this.productsCount = count;
    });
    this.cartService.getCart().subscribe(cart => {
      console.log(cart);
    });
  }
}
