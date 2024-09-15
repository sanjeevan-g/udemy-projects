import { combineReducers } from "redux";
import { createStore } from "redux";
import accountReducer from "./features/accounts/accountSlice";
import customerReducer from "./features/customers/customerSlice";
import { applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";


const rootReducer = combineReducers({
    account: accountReducer,
    customer: customerReducer
})

const store = createStore(rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

export default store;


/*
When a store is created, Redux dispatches a dummy action to your reducer to populate the store with the initial state. You are not meant to handle the dummy action directly. Just remember that your reducer should return some kind of initial state if the state given to it as the first argument is undefined
*/

// console.log(store.getState());

// directly passing the action to dispatch function
// store.dispatch({ type: "account/deposit", payload: 500 });


// store.dispatch({
//     type: "account/requestLoan", payload: {
//         amount: 1000, loanPurpose: "Buy a car"
//     }
// })
// store.dispatch({
//     type: "account/payLoan"
// })
// console.log(store.getState());


// in redux, we will call actionCreator function to return our action
// dispatch will work by directly passing action too, but using the actionCreator is a convention


// store.dispatch(deposit(1000));

// console.log(store.getState());
// store.dispatch(widthdraw(300))
// console.log(store.getState());
// store.dispatch(requestLoan(500, "Test the loan"))
// console.log(store.getState());
// store.dispatch(payLoan())
// console.log(store.getState());




// store.dispatch(createCustomer("sanjeevan", "1234"));
// console.log(store.getState());