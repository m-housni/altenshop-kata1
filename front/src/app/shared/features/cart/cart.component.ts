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
  public products: Product[] = [];
  public quantities: number[] = [];
  public cart: any[] = [];

  constructor() {
    this.cartService.getCart().subscribe(cart => {
      let products = Array.from(cart.keys());
      let quantities = Array.from(cart.values());
      this.products = products;
      this.quantities = quantities;
      this.cart = products.map((p, index) => [p, quantities[index]])
    });
  }

  public onDelete(product: Product) {
    // delete product
    this.cartService.removeProductFromCart(product).subscribe(cart => {

    });
    //alert("deleting product ..");
  }
}
