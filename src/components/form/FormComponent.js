import { useState, useEffect, useRef } from "react";
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
  const [searchedCity, setSearchedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const isValidCityName = (input) => /^[a-zA-Zá-žÁ-Ž\s]+$/.test(input);

  //focus na input po načtení komponenty
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ------------------------------------------stáhnout počasí z API
  const fetchWeather = async (city) => {
    setIsLoading(true);
    setError(""); // vyčistit starou chybu

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(error_messages.cityNotFound);

      const data = await response.json();
      setWeather({
        country: data.sys.country,
        icon: data.weather?.[0]?.icon,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        clouds: data.clouds.all,
        wind: data.wind.speed,
      });
    } catch (err) {
      const message =
        err?.message === "Failed to fetch" || err?.message === "Load failed"
          ? error_messages.fetchError
          : err?.message || error_messages.fetchError;

      setError(message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  //------------------------------------------Formulář
  const formSubmit = (e) => {
    e.preventDefault();

    const normalized = cityName.trim();

    if (!normalized || !isValidCityName(normalized)) {
      setError(error_messages.invalidCityName);
      return;
    }
    setSearchedCity(normalized); // uložit hledané město pro zobrazení v kartě
    setCityName("");
    fetchWeather(normalized);
    inputRef.current?.focus();
  };

  return (
    <div>
      {/* formulář */}
      <form className="form-section" onSubmit={formSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Název města"
          value={cityName}
          onChange={(event) => setCityName(event.target.value)}
          className={error ? "input-error" : "input-city"}
        />

        {error && <p className="error">{error}</p>}

        <button className="button-city" type="submit" disabled={isLoading}>
          {isLoading ? "Načítám..." : "Hledat"}
        </button>
      </form>
      {/* karta */}
      {(isLoading || weather) && (
        <div className="weather-card">
          {searchedCity && <h2>{searchedCity}</h2>}

          {isLoading ? (
            <h2>Načítání dat...</h2>
          ) : (
            <div className="weather-data">
              <p>{weather.country}</p>

              {weather.icon && (
                <img
                  className="weather-image"
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="Ikona počasí"
                />
              )}
              <p>
                Teplota: <span className="value">{weather.temp} °C</span>
              </p>
              <p>
                Pocitová teplota:{" "}
                <span className="value">{weather.feels_like} °C</span>
              </p>
              <p>
                Oblačnost: <span className="value">{weather.clouds} %</span>
              </p>
              <p>
                Rychlost větru:{" "}
                <span className="value">{weather.wind} m/s</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormComponent;
