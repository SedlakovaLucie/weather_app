import { useEffect, useState } from "react";
import "./OneCity.css";

const OneCity = ({ city, temperature, image, isLoadingData }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(!image);
  }, [image]);

  return (
    <div className="one-city">
      <div className="image-wrap">
        {imgLoaded ? null : <div className="skeleton skeleton-img" />}

        {image ? (
          <img
            src={image}
            alt={`Fotografie města ${city}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            className={imgLoaded ? "img-visible" : "img-hidden"}
          />
        ) : null}
      </div>

      {isLoadingData ? (
        <>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
        </>
      ) : (
        <>
          <h3>{city}</h3>
          <p>Teplota: {temperature} °C</p>
        </>
      )}
    </div>
  );
};

export default OneCity;
