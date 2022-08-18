import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Store, select } from '@ngrx/store';
import { Product } from '../product/product.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartCount = 0;
  totalVal = 0;
  cart = [];
  constructor(private cartService: CartService, private router: Router, private store: Store<{ items: Product[]; cart: [], filtred: [] }>) {
    store.pipe(select('shop')).subscribe(data => {
      this.cart = data.cart
      this.totalVal = this.cart.reduce((accum, item) => accum + item.price, 0);
      this.cartCount = this.cart.reduce((accum, item) => accum + item.quantity, 0);
    }
    );
  }
  navigateToCart() {
    this.router.navigate(['/cart']);
  }

}
