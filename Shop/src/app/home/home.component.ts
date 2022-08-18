import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../product/product.component';
import { ShopService } from '../shop.service';
import { GetItems, SetFromLocalStorage, FilterItems, SetCartCount } from '../store/actions';
import { Cart } from '../interfaces/Cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, OnInit {

  constructor(private shopService: ShopService, private cartService: CartService, private store: Store<{ items: Product[]; cart: [], filtred: [] }>) {
    const sub = store.pipe(select('shop')).subscribe(data => (this.items = data.filtred, this.cart = data.cart));
    this.subscriptions.push(sub);
    console.log(this.items);

  }

  items: Product[] = [];
  cart: Cart[] = [];
  public subscriptions: Subscription[] = [];

  ngOnInit() {
    this.store.dispatch(new GetItems());
    setTimeout(() => {
      console.log(this.items);

      let cartItems: Cart[] = this.cartService.getCartDataFromLocalStorage();
      this.store.dispatch(new SetFromLocalStorage(cartItems));

      if (cartItems && cartItems.length > 0) {
        this.cart.forEach(cartItem => {
          this.items[this.items.findIndex(el => el.id === cartItem.id)] = { ...cartItem, inCart: true, inCartQty: cartItem.quantity };
        });
        this.store.dispatch(new FilterItems(this.items));
        // this.store.dispatch(new SetCartCount(cartItems.length));

      }

        

    }, 100);


  }
  public ngOnDestroy(): void {
    this.shopService.clearSubscriptions(this.subscriptions);
  }

}
