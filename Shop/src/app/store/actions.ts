import { Action } from '@ngrx/store';
import { Cart } from '../interfaces/Cart';
import { Product } from '../product/product.component';


export enum ActionTypes {
  Add = '[Product] Add to cart',
  Remove = '[Product] Remove from cart',
  LoadItems = '[Products] Load items from server',
  LoadSuccess = '[Products] Load success',
  FilterItems = '[Products] Filtred success',
  UpdateItemQuantity = '[Cart] Update Item Quantity',
  SetFromLocalStorage = '[Cart] init from localStorage',
  SetCartCount = '[Cart] item count'
}

export class AddToCart implements Action {
  readonly type = ActionTypes.Add;
  constructor(public payload: Product) { }
}

export class GetItems implements Action {
  readonly type = ActionTypes.LoadItems;
}

export class RemoveFromCart implements Action {
  readonly type = ActionTypes.Remove;
  constructor(public payload: Cart[]) { }
}
export class UpdateQuantity implements Action {
  readonly type = ActionTypes.UpdateItemQuantity;
  constructor(public payload: Product) { }
}

export class SetFromLocalStorage implements Action {
  readonly type = ActionTypes.SetFromLocalStorage;
  constructor(public payload: Cart[]) { }
}

export class LoadItems implements Action {
  readonly type = ActionTypes.LoadSuccess;
  constructor(public payload: Product[]) { }
}


export class FilterItems implements Action {
  readonly type = ActionTypes.FilterItems;
  constructor(public payload: Product[]) {
  }
}
  
  export class SetCartCount implements Action {
  readonly type = ActionTypes.SetCartCount;
  constructor(public payload: number) { }
}



export type ActionsUnion = AddToCart | RemoveFromCart | LoadItems | GetItems | FilterItems | UpdateQuantity | SetFromLocalStorage | SetCartCount;