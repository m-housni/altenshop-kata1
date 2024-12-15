import { Injectable } from '@angular/core';
import { Product } from '../../products/data-access/product.model'; // Adjust the import path as needed
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Map<number, { product: Product, quantity: number }> = new Map();
  private cartSubject: BehaviorSubject<Map<number, { product: Product, quantity: number }>> = new BehaviorSubject<Map<number, { product: Product, quantity: number }>>(this.cart);

  addProductToCart(product: Product, quantity: number = 1): void {
    if (this.cart.has(product.id)) {
      const cartItem = this.cart.get(product.id)!;
      cartItem.quantity += quantity;
    } else {
      this.cart.set(product.id, { product, quantity });
    }
    this.cartSubject.next(this.cart); // Notify subscribers
  }

  decreaseProductQuantity(product: Product, quantity: number = 1): void {
    if (this.cart.has(product.id)) {
      const cartItem = this.cart.get(product.id)!;
      if (cartItem.quantity > quantity) {
        cartItem.quantity -= quantity;
      } else {
        this.cart.delete(product.id);
      }
      this.cartSubject.next(this.cart); // Notify subscribers
    }
  }

  getCart(): Observable<Map<number, { product: Product, quantity: number }>> {
    return this.cartSubject.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartSubject.asObservable().pipe(
      map(cart => Array.from(cart.values()).reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  getUniqueProductCount(): Observable<number> {
    return this.cartSubject.asObservable().pipe(
      map(cart => cart.size)
    );
  }

  clearCart(): Observable<void> {
    return new Observable<void>(observer => {
      this.cart.clear();
      this.cartSubject.next(this.cart); // Notify subscribers
      observer.next();
      observer.complete();
    });
  }

  removeProductFromCart(product: Product): Observable<void> {
    return new Observable<void>(observer => {
      this.cart.delete(product.id);
      this.cartSubject.next(this.cart); // Notify subscribers
      observer.next();
      observer.complete();
    });
  }
}
