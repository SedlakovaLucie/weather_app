import { useState, useRef } from "react";
import "./FormComponent.css";

const error_messages = {
  invalidCityName: "Zadejte prosím platný název města, např. Praha.",
  cityNotFound: "Město, které hledáte, neexistuje. Zkuste to znovu! :)",
  fetchError:
    "Počasí momentálně nelze načíst. Zkontrolujte připojení nebo to zkuste později.",
};

const FormComponent = () => {
  const [weather, setWeather] = useState(null);
  const [cityName, setCityName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const cityRef = useRef("");
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const isValidCityName = (input) => /^[a-zA-Zá-žÁ-Ž\s]+$/.test(input);

  const getWeather = async () => {
    setIsLoading(true);
    setError("");

    //URL for OpenWeatherMap API: https://openweathermap.org/current
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityRef.current}&units=metric&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(error_messages.cityNotFound);
      }
      const data = await response.json();
      setWeather({
        temp: data.main.temp,
        icon: data.weather[0].icon,
        country: data.sys.country,
        clouds: data.clouds.all,
        wind: data.wind.speed,
        feels_like: data.main.feels_like,
      });
    } catch (error) {
      const errorMessage =
        error.message === "Failed to fetch" || error.message === "Load failed"
          ? error_messages.fetchError
          : error.message;
      setError(errorMessage);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (!isValidCityName(cityName)) {
      setError(error_messages.invalidCityName);
      return;
    }

    cityRef.current = cityName;
    setCityName("");

    getWeather();
  };

  return (
    <div>
      <div>
        <form className="form-section" onSubmit={formSubmit}>
          <input
            type="text"
            placeholder="Název města"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
            className={error ? "input-error" : "input-city"}
          />
          {error && <p className="error">{error}</p>}
          <button className="button-city" type="submit">
            Hledat
          </button>
        </form>
      </div>
      {weather && (
        <div className="weather-card">
          {cityRef.current && <h2>{cityRef.current}</h2>}

          {isLoading ? (
            <h2>Načítání dat...</h2>
          ) : (
            (() => {
              const { temp, icon, country, clouds, wind } = weather;
              return (
                <div className="weather-data">
                  <p>{country}</p>
                  <img
                    className="weather-image"
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    alt="Ikona počasí"
                  />
                  <p>
                    Teplota: <span className="value">{temp} °C</span>
                  </p>
                  <p>
                    Pocitová teplota:{" "}
                    <span className="value">{weather.feels_like} °C</span>
                  </p>
                  <p>
                    Oblačnost: <span className="value">{clouds} %</span>
                  </p>
                  <p>
                    Rychlost větru: <span className="value">{wind} m/s</span>
                  </p>
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
};

export default FormComponent;
