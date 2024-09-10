import { combineReducers } from "redux";
import { createStore } from "redux";


const initialStateAccount = {
    balance: 0,
    loan: 0,
    loanPurpose: ""
}

const initialStateCustomer = {
    fullName: "",
    nationalID: "",
    createdAt: null
}

function accountReducer(state = initialStateAccount, action) {

    switch (action.type) {
        // stateDomain/action
        case "account/deposit": {
            return {
                ...state,
                balance: state.balance + action.payload
            }
        }
        case "account/withdraw": {
            return {
                ...state,
                balance: state.balance - action.payload
            }
        }
        // later 
        case "account/requestLoan": {
            return {
                ...state,
                loan: action.payload.amount,
                loanPurpose: action.payload.purpose,
                balance: state.balance + action.payload.amount
            }
        }

        case "account/payLoan": {
            return {
                ...state,
                loan: 0,
                loanPurpose: "",
                balance: state.balance - state.loan,
            }
        }

        default: return state;
    }
}

function customerReducer(state = initialStateCustomer, action) {
    switch (action.type) {
        case "customer/createCustomer": {
            return {
                ...state,
                fullName: action.payload.fullName,
                nationalID: action.payload.nationalID,
                createdAt: action.payload.createdAt
            }
        }
        case "customer/updateName": {
            return {
                ...state,
                fullName: action.payload
            }
        }
        default: {
            return state
        }
    }
}

/* 
When a store is created, Redux dispatches a dummy action to your reducer to populate the store with the initial state. You are not meant to handle the dummy action directly. Just remember that your reducer should return some kind of initial state if the state given to it as the first argument is undefined
*/

const rootReducer = combineReducers({
    account: accountReducer,
    customer: customerReducer
})

const store = createStore(rootReducer);
console.log(store.getState());

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

function deposit(amount) {
    return { type: "account/deposit", payload: amount }
}

function widthdraw(amount) {
    return { type: "account/withdraw", payload: amount }
}
function requestLoan(amount, purpose) {
    return {
        type: "account/requestLoan", payload: {
            amount, purpose
        }
    }
}
function payLoan() {
    return {
        type: "account/payLoan"
    }
}

store.dispatch(deposit(1000));

console.log(store.getState());
store.dispatch(widthdraw(300))
console.log(store.getState());
store.dispatch(requestLoan(500, "Test the loan"))
console.log(store.getState());
store.dispatch(payLoan())
console.log(store.getState());

function createCustomer(fullName, nationalID) {
    return {
        type: "customer/createCustomer",
        payload: {
            fullName,
            nationalID,
            createdAt: new Date().toISOString() // it is a sideeffect, so it has to be in action creator function
        }
    }
}
function updateName(fullname) {
    return {
        type: "customer/updateName",
        payload: fullname
    }
}


store.dispatch(createCustomer("sanjeevan", "1234"));
console.log(store.getState());