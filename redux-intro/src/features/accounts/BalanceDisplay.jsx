/* eslint-disable react/prop-types */
import { connect } from "react-redux";
// import { useSelector } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

// legacy way of connectiong store to component
function BalanceDisplay({ balance }) {

  // using hooks
  // const balance = useSelector(store => store.account.balance)

  return <div className="balance">{ formatCurrency(balance) }</div>;
}

// this connect will take a function a argument which has access to store and return a data we need
// then the connect will return another function which take our component as argument

function mapStateToProps(state) {
  return {
    balance: state.account.balance
  }
}

export default connect(mapStateToProps)(BalanceDisplay);
