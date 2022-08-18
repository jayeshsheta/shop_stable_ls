import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ShopService } from '../shop.service';
import { ActionTypes } from './actions';

@Injectable()
export class ShopEffects {
  @Effect()
  loadProducts$ = this.actions$.pipe(
    ofType(ActionTypes.LoadItems),
    mergeMap(() =>
      this.shopService.getProducts().pipe(
        map(products => {
          return { type: ActionTypes.LoadSuccess, payload: products };
        }),
        catchError(() => EMPTY)
      )
    )
  );

  constructor(
    private actions$: Actions,
    private shopService: ShopService
  ) {}
}