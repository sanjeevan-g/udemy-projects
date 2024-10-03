import { createSlice } from "@reduxjs/toolkit"

const initialStateAccount = {
    balance: 0,
    loan: 0,
    loanPurpose: "",
    isLoading: false
}
const host = "api.frankfurter.app"

const accountSlice = createSlice({
    name: "account",
    initialState: initialStateAccount,
    reducers: {
        deposit(state, action) {
            state.balance = state.balance + action.payload
            state.isLoading = false;
        },
        withdraw(state, action) {
            state.balance = state.balance - action.payload
        },
        requestLoan: {
            prepare(amount, purpose) {
                return {
                    payload: { amount, purpose }
                }
            },
            reducer(state, action) {
                // will keep existing state
                if (state.loan > 0) return;
                state.loan = action.payload.amount;
                state.loanPurpose = action.payload.purpose
                state.balance += action.payload.amount;
            }
        },
        payLoan(state) {
            state.balance -= state.loan;
            state.loanPurpose = ''
            state.loan = 0
        },
        convertingCurrency(state) {
            state.isLoading = true
        }
    }
})

// console.log(accountSlice.actions.deposit)

export const { payLoan, requestLoan, withdraw } = accountSlice.actions;

export default accountSlice.reducer;

// we can use normal action creator functions to use thunk
export function deposit(amount, currency) {
    /*
    if currency is usd no action needed, return action object
    */

    // in RTK, return type must match name/reducerName in sliceFn
    if (currency === 'USD') return { type: "account/deposit", payload: amount }

    // else use thunk, return thunk function
    return async function (dispatch, getState) {

        // set isloading true
        dispatch({
            type: 'account/convertingCurrency'
        })

        const res = await fetch(`https://${host}/latest?amount=${amount}&from=${currency}&to=USD`)
        const data = await res.json();

        const convertedAmount = data.rates.USD
        dispatch({ type: "account/deposit", payload: convertedAmount })
    }
}


// // reducer
// export default function accountReducer(state = initialStateAccount, action) {

//     switch (action.type) {
//         // stateDomain/action
//         case "account/deposit": {
//             return {
//                 ...state,
//                 balance: state.balance + action.payload,
//                 isLoading: false
//             }
//         }
//         case "account/withdraw": {
//             return {
//                 ...state,
//                 balance: state.balance - action.payload
//             }
//         }
//         // later
//         case "account/requestLoan": {
//             return {
//                 ...state,
//                 loan: action.payload.amount,
//                 loanPurpose: action.payload.purpose,
//                 balance: state.balance + action.payload.amount
//             }
//         }

//         case "account/payLoan": {
//             return {
//                 ...state,
//                 loan: 0,
//                 loanPurpose: "",
//                 balance: state.balance - state.loan,
//             }
//         }

//         case "account/convertingCurrency": {
//             return {
//                 ...state,
//                 isLoading: true
//             }
//         }

//         default: return state;
//     }
// }

// // action creators
// export function deposit(amount, currency) {
//     /*
//     if currency is usd no action needed, return action object
//     */
//     if (currency === 'USD') return { type: "account/deposit", payload: amount }

//     // else use thunk, return thunk function
//     return async function (dispatch, getState) {

//         // set isloading true
//         dispatch({
//             type: 'account/convertingCurrency'
//         })

//         const res = await fetch(`https://${host}/latest?amount=${amount}&from=${currency}&to=USD`)
//         const data = await res.json();

//         const convertedAmount = data.rates.USD
//         dispatch({ type: "account/deposit", payload: convertedAmount })
//     }
// }

// export function widthdraw(amount) {
//     return { type: "account/withdraw", payload: amount }
// }
// export function requestLoan(amount, purpose) {
//     return {
//         type: "account/requestLoan", payload: {
//             amount, purpose
//         }
//     }
// }
// export function payLoan() {
//     return {
//         type: "account/payLoan"
//     }
// }
