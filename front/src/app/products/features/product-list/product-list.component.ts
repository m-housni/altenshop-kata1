import { Component, OnInit, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { CartService } from "app/cart/data-access/cart.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ProductDetailsComponent } from "app/products/ui/product-details/product-details.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, ProductDetailsComponent, PaginatorModule, FormsModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isDisplay = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);
  public readonly displayedProduct = signal<Product>(emptyProduct);

  public first = 0;
  public rows = 10;

  public filterText = '';

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onDisplay(product: Product) {
    this.isDisplay = true;
    this.displayedProduct.set(product);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public addToCart(product: Product) {
    this.cartService.addProductToCart(product, product.quantity);
    console.log(`${product.name} with quantity ${product.quantity} added to cart`);
  }

  public onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  public get filteredProducts() {
    return this.products().filter(product =>
      product.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      product.category.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  // Method to increase the quantity of a product
  public increaseQuantity(product: Product) {
    if (product.quantity === undefined || product.quantity === null) {
      product.quantity = 0;
    }
    product.quantity += 1;
    this.productsService.update(product).subscribe();
  }

  // Method to decrease the quantity of a product
  public decreaseQuantity(product: Product) {
    if (product.quantity === undefined || product.quantity === null) {
      product.quantity = 0;
    }
    if (product.quantity > 0) {
      product.quantity -= 1;
      this.productsService.update(product).subscribe();
    }
  }
}
