import { ActionsUnion, ActionTypes } from './actions';

export const initialState = {
    products: [],
    cart: [],
    filtred: [],
    cartItemCount:0,
    cartTotal:0
};

export function ShopReducer(state = initialState, action: ActionsUnion) {
    debugger
    console.log(state);
    console.log(action);

    switch (action.type) {
        case ActionTypes.LoadSuccess:
            return {
                ...state,
                products: [...action.payload],
                filtred: [...action.payload]
            };

        case ActionTypes.Add:
            return {
                ...state,
                cart: [...state.cart, action.payload]
            };

        case ActionTypes.UpdateItemQuantity:
            return {
                ...state,
                cart: [...state.cart.filter(item => item.id !== action.payload.id), action.payload]
            };

        case ActionTypes.SetFromLocalStorage:
            return {
                ...state,
                cart: action.payload
            };
        case ActionTypes.Remove:
            return {
                ...state,
                cart: action.payload
                // cart: [...state.cart.filter(item => item.name !== action.payload.name)]
            };

        case ActionTypes.FilterItems:
            return {
                ...state,
                cart: [...state.cart],
                filtred: [...action.payload]
            };

            case ActionTypes.SetCartCount:
                return {
                    ...state,
                  cartItemCount:action.payload
                };
    


        default:
            return state;
    }
}
