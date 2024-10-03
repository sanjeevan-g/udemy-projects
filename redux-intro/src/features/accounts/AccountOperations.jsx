import { useState } from "react";
import { deposit, payLoan, requestLoan, withdraw } from "./accountSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [currency, setCurrency] = useState("USD");

  const dispatch = useDispatch();

  const { balance, loan, loanPurpose: currentLoanPurpose, isLoading } = useSelector(state => state.account);

  function handleDeposit() {
    if (!depositAmount) return;

    dispatch(deposit(depositAmount, currency));
    // dispatch(deposit(depositAmount));

    setDepositAmount("")
    setCurrency('USD');
  }

  function handleWithdrawal() {
    if (!withdrawalAmount || withdrawalAmount > balance) return;

    // console.log(withdrawalAmount > balance, withdrawalAmount)

    dispatch(withdraw(withdrawalAmount));

    setWithdrawalAmount("")
  }

  function handleRequestLoan() {
    if (loanAmount == 0 || !loanPurpose) return;

    // by default toolkit reducer accept only one argument
    // so send it as object
    // dispatch(requestLoan({amount: loanAmount, purpose : loanPurpose}));

    // if we need to pass more than 1 value then use 'prepare method' in the reducer
    dispatch(requestLoan(loanAmount, loanPurpose));

    setLoanAmount("")
    setLoanPurpose("")
  }

  function handlePayLoan() {
    if (loan > balance) return;
    dispatch(payLoan());
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={ depositAmount }
            onChange={ (e) => setDepositAmount(+e.target.value) }
          />
          <select
            value={ currency }
            onChange={ (e) => setCurrency(e.target.value) }
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={ handleDeposit } disabled={ isLoading } >
            {
              isLoading ? 'converting' : `Deposit ${depositAmount}`
            }
          </button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={ withdrawalAmount }
            onChange={ (e) => setWithdrawalAmount(+e.target.value) }
          />
          <button onClick={ handleWithdrawal }>
            Withdraw { withdrawalAmount }
          </button>
        </div>

        <div>
          <label>Request loan</label>
          <input
            type="number"
            value={ loanAmount }
            onChange={ (e) => setLoanAmount(+e.target.value) }
            placeholder="Loan amount"
          />
          <input
            value={ loanPurpose }
            onChange={ (e) => setLoanPurpose(e.target.value) }
            placeholder="Loan purpose"
          />
          <button onClick={ handleRequestLoan }>Request loan</button>
        </div>

        { loan > 0 &&
          (<div>
            <span>Pay back ${ loan }({ currentLoanPurpose })</span>
            <button onClick={ handlePayLoan }>Pay loan</button>
          </div>)
        }
      </div>
    </div>
  );
}

export default AccountOperations;
