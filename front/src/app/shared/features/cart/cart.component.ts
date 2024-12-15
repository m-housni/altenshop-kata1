import { Component, inject, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CartService } from "../../../cart/data-access/cart.service"; // Correct import path for CartService
import { Product } from "app/products/data-access/product.model";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [CardModule, RouterLink, ButtonModule],
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  public cart: { product: Product, quantity: number }[] = [];

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    this.cartService.getCart().subscribe(cart => {
      this.cart = Array.from(cart.values());
    });
  }

  public onDelete(product: Product) {
    this.cartService.removeProductFromCart(product).subscribe(() => {
      this.loadCart();
    });
  }

  public increaseQuantity(product: Product) {
    this.cartService.addProductToCart(product, 1);
    this.loadCart();
  }

  public decreaseQuantity(product: Product) {
    this.cartService.decreaseProductQuantity(product, 1);
    this.loadCart();
  }
}
