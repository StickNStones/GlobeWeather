import React, { useState } from "react";



export function CityForm(props) {
    const [city, setCity] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        console.log(city);
        populateWeatherInfo();
        alert(`submitting City ${city}`);
        //props.onForecastChange(e.target.value);
    }

    const populateWeatherInfo = async () => {
        const response = await fetch(`Forecast/${city}`);
        //const response = await fetch(`Forecast`);
        try {
            console.log(response);
            const data = await response.json();
            if (data[0] != null) {
                props.onForecastChange({ forecasts: data });

            }
        }
        catch (err) {
            console.log("err", err);
        }
    }
        
    const handleCityChange = ({ target }) => {
        setCity(target.value)
    }
    return (
        <div class="col input-group align-self-end">
            <form class="form-inline" >
                <label className="sr-only" for="inlineFormInputName2"> Name </label>
                <input type="text" className="form-control mb-2 mr-sm-2" id="inlineFormInputName2" placeholder="City" value={city} autoComplete="off" onChange={handleCityChange} />
            </form>
            <button type="submit-inline" class="btn btn-primary mb-2" onClick={handleChange} > Submit </button>
        </div>
    )
}