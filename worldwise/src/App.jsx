import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";

const BASE_URL = "http://localhost:4200";

function App() {

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data)
        setCities(data);

      } catch (e) {
        console.error(`there was an error fetching cities `, e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities();
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={ <Homepage /> } />
          <Route path="product" element={ <Product /> } />
          <Route path="pricing" element={ <Pricing /> } />
          <Route path="app" element={ <AppLayout /> } >
            <Route index element={ <CityList cities={cities} isLoading={isLoading} /> } />
            <Route path="cities" element={ <CityList cities={cities} isLoading={isLoading} /> } />
            <Route path="countries" element={ <CountryList cities={cities} isLoading={isLoading} /> } />
            <Route path="form" element={ <p>form element</p> } />
          </Route>
          <Route path="login" element={ <Login /> } />
          <Route path="*" element={ <PageNotFound /> } />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
