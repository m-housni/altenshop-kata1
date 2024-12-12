import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { SelectItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: "app-product-details",
  template: `
    <div class="product">
      <div class="product-field">
        <img [src]="displayedProduct().image" [alt]="displayedProduct().name" />
      </div>
      <div class="product-field">
        <p [textContent]="displayedProduct().description"></p>
      </div>
      <div class="product-field">
        <p [textContent]="'€'+displayedProduct().price"></p>
      </div>
      <div class="product-field">
        <p [textContent]="displayedProduct().category"></p>
      </div>
      <div class="product-field">
        <p [textContent]="displayedProduct().inventoryStatus"></p>
      </div>
      <div class="product-field">
        <p [textContent]="displayedProduct().code"></p>
      </div>
      <div class="product-field">
        <p [textContent]="displayedProduct().internalReference"></p>
      </div>
    </div>
  `,
  styleUrls: ["./product-details.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailsComponent {
  public readonly product = input.required<Product>();

  public readonly displayedProduct = computed(() => ({ ...this.product() }));


  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }
}
