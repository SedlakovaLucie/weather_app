import "./Cities.css";
import { useEffect, useState } from "react";
import OneCity from "./OneCity";
import cityImages from "./CityImages";

const Cities = () => {
  const cityNames = [
    "Prague",
    "New York",
    "London",
    "Moscow",
    "Rio de Janeiro",
  ];

  const [weatherData, setWeatherData] = useState(() =>
    cityNames.map((c) => ({ requestedCity: c, city: c, temp: null }))
  );

  const [error, setError] = useState("");
  const errorMessage =
    "Počasí momentálně nelze načíst. Zkontrolujte připojení nebo to zkuste později.";

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const getWeatherData = async (requestedCity) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      requestedCity
    )}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("fetch_failed");

      const data = await response.json();
      return { city: data.name, temp: data.main.temp, ok: true };
    } catch {
      return { city: requestedCity, temp: "-", ok: false };
    }
  };

  useEffect(() => {
    let cancelled = false;
    setError("");

    setWeatherData(
      cityNames.map((c) => ({ requestedCity: c, city: c, temp: null }))
    );

    (async () => {
      const results = await Promise.all(
        cityNames.map(async (requestedCity) => {
          const result = await getWeatherData(requestedCity);
          return { requestedCity, ...result };
        })
      );

      if (cancelled) return;

      if (results.some((r) => !r.ok)) {
        setError(errorMessage);
      }

      setWeatherData(
        results.map(({ requestedCity, city, temp }) => ({
          requestedCity,
          city,
          temp,
        }))
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="cities-section">
      <h2>Teploty ve světových městech</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="cities-container">
        {weatherData.map(({ requestedCity, city, temp }) => (
          <OneCity
            key={requestedCity}
            city={city}
            temperature={temp}
            isLoadingData={temp === null}
            image={cityImages[requestedCity]}
          />
        ))}
      </div>
    </div>
  );
};

export default Cities;
