import { useSelector } from "react-redux";




function Customer() {
  // useSelector will call a function with whole store state as props and return the required data 
  const customer = useSelector(store => store.customer.fullName)
  // console.log(customer)
  return <h2>👋 Welcome, {customer}</h2>;
}

export default Customer;
