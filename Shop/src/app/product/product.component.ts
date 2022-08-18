import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { Cart } from '../interfaces/Cart';
import { ShopService } from '../shop.service';
import { AddToCart, FilterItems, RemoveFromCart, UpdateQuantity } from '../store/actions';

export interface Product {
  id: number;
  imageURL: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  color: string;
  gender: string;
  quantity: number;
  inCart?: boolean;
  inCartQty?: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements OnDestroy {

  altImgUrl: string = 'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/polo-tshirts.png';
  public subscriptions: Subscription[] = [];

  constructor(private cartService: CartService, private shopService: ShopService, private store: Store<{ products: Product[]; cart: [], filtred: [] }>) {
    const sub = store.pipe(select('shop')).subscribe(data => { this.products = data.products; this.cart = data.cart });
    this.subscriptions.push(sub);
  }

  products = [];
  cart: Cart[] = [];
  @Input() product: Product;

  addToCart(item: Product) {
    if (!this.allowItemToAdd(item)) {
      alert('Maximum product limit reached or no item available to purchase.')
      return;
    }
    debugger
    const itemCopy = { ...item };
    delete itemCopy.inCartQty;
    delete itemCopy.inCart;
    const cartItemObj: Cart = {
      ...itemCopy,
      quantity: (item.inCartQty ? item.inCartQty : 1)
    }
    if (this.cart.findIndex(i => i.id === item.id) === -1) {
      this.store.dispatch(new AddToCart(cartItemObj));
    }
    else {
      cartItemObj.quantity += 1;
      this.store.dispatch(new UpdateQuantity(cartItemObj));
    }
    this.cartService.setCartDataFromLocalStorage(this.cart);
    this.cart.forEach(cartItem => {
      this.products[this.products.findIndex(el => el.id === item.id)] = { ...item, inCart: true, inCartQty: (cartItem.id === item.id ? cartItemObj.quantity : cartItem.quantity) };
    });
    this.store.dispatch(new FilterItems(this.products));
  }

  onDelete(item) {
    if (this.cart.findIndex(x => x.id === item.id) > -1) {
      this.cart.splice(this.cart.findIndex(x => x.id === item.id), 1);
    }
    this.store.dispatch(new RemoveFromCart(this.cart));
    this.cartService.setCartDataFromLocalStorage(this.cart);
    const allProducts = this.products.map(({ inCartQty, ...item }) => item);
    this.cart.forEach(cartItem => {
      allProducts[allProducts.findIndex(el => el.id === cartItem.id)] = { ...cartItem, inCart: true, inCartQty: cartItem.quantity }
    });
    this.store.dispatch(new FilterItems(allProducts));

  }
  allowItemToAdd(item: Product) {
    debugger
    if(this.cart==null) return true;
    let cartQty = 0;
    let itemInStock = 0;
    if (this.cart.findIndex(x => x.id === item.id) === -1) {
      cartQty = 0;
    }
    else {
      cartQty = this.cart[this.cart.findIndex(x => x.id === item.id)].quantity;
    }
    if (this.products.findIndex(x => x.id === item.id) === -1) {
      itemInStock = 0;
    }
    else {
      itemInStock = this.products[this.products.findIndex(x => x.id === item.id)].quantity;
    }
    console.log(cartQty, itemInStock);
    return cartQty < itemInStock;
  }
  removeFromCart(item: Product) {
    if (this.cart.find(x => x.id === item.id).quantity === 1) {
      this.onDelete(item);
      return;
    }
    else {
      const itemCopy = { ...item };
      delete itemCopy.inCartQty;
      delete itemCopy.inCart;
      this.cart[this.cart.findIndex(x => x.id === item.id)] = { ...itemCopy, quantity: item.inCartQty - 1 };
    }
    this.store.dispatch(new RemoveFromCart(this.cart));
    this.cartService.setCartDataFromLocalStorage(this.cart);
    const allProducts = this.products.map(({ inCartQty, ...item }) => item);
    this.cart.forEach(cartItem => {
      allProducts[allProducts.findIndex(el => el.id === cartItem.id)] = { ...cartItem, inCart: true, inCartQty: cartItem.quantity };
    });
    this.store.dispatch(new FilterItems(allProducts));
  }
  setAltImg() {
    this.altImgUrl = '/assets/images/default.png'
  }
  ngOnDestroy() {
    this.shopService.clearSubscriptions(this.subscriptions)
  }
}
