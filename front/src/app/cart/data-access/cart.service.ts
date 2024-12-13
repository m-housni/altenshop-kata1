import { Injectable } from '@angular/core';
import { Product } from '../../products/data-access/product.model'; // Adjust the import path as needed
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Map<Product, number> = new Map();
  private cartSubject: BehaviorSubject<Map<Product, number>> = new BehaviorSubject<Map<Product, number>>(this.cart);

  addProductToCart(product: Product): void {
    const existingProduct = Array.from(this.cart.keys()).find(p => p.id === product.id);
    if (existingProduct) {
      this.cart.set(existingProduct, this.cart.get(existingProduct)! + 1);
    } else {
      this.cart.set(product, 1);
    }
    this.cartSubject.next(this.cart); // Notify subscribers
  }

  getCart(): Observable<Map<Product, number>> {
    return this.cartSubject.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartSubject.asObservable().pipe(
      map(cart => Array.from(cart.values()).reduce((acc, quantity) => acc + quantity, 0))
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
      const existingProduct = Array.from(this.cart.keys()).find(p => p.id === product.id);
      if (existingProduct) {
        this.cart.delete(existingProduct);
        this.cartSubject.next(this.cart); // Notify subscribers
      }
      observer.next();
      observer.complete();
    });
  }
}
