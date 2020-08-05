import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import axios from "axios";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import LineGraph from "./LineGraph"
import { sortData } from './util'

// await  fetch('https://disease.sh/v3/covid-19/countries')
// .then(data => data.json())
// .then((data) => {
//   const countries = data.map((el) => (
//     {
//       name: el.country,
//       value: el.countryInfo.iso2
//     }
//   ))

//   setCountries(countries)
// })

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [ countryInfo, setCountryInfo ] = useState({});
  const [ tableData, setTableData ] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data)
    })
  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
      let result = await axios.get("https://disease.sh/v3/covid-19/countries");

      let { data } = await result;
    
      const countries = await data.map((el) => ({
        name: el.country,
        value: el.countryInfo.iso2,
      }));


      const sortedData = sortData(data)
      setTableData(sortedData);
      setCountries(countries);
    };
    getCountriesData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;

   // setCountry(countryCode);

    const url = await countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`



    let { data } = await axios.get(url)
   
    setCountry(countryCode)
    setCountryInfo(data)

  //  await fetch(url)
  //   .then(res => res.json())
  //   .then(data => {
  //     setCountry(countryCode)

  //     setCountryInfo(data)
  //   })

    
    

  };

  

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app___dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((el) => {
                return (
                  <MenuItem key={el.value} value={el.value}>
                 
                    {el.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
          
        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
          <Map />
      </div>
      <Card className="app__right">
      <CardContent>
        <h3>Live Cases by country</h3>
            <Table countries={tableData} />
        <h3>World new Cases</h3>
        <LineGraph />
      </CardContent>
      </Card>
    </div>
  );
}

export default App;
