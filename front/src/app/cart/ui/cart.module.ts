import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartBadgeComponent } from './cart-badge/cart-badge.component';

@NgModule({
  declarations: [CartBadgeComponent],
  imports: [CommonModule],
  exports: [CartBadgeComponent]
})
export class CartModule {}
