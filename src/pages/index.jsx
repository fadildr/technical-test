import { useState, useEffect } from "react";
import CONSTANT from "../utils/constant";
import { AiOutlineCloud } from "react-icons/ai";
import { TiWeatherSunny } from "react-icons/ti";
import {
  BsCloudDrizzle,
  BsCloudRain,
  BsCloudLightningRain,
  BsCloudHaze,
} from "react-icons/bs";
const HomePage = () => {
  const [selectedCity, setSelectedCity] = useState("Jakarta");
  const [selectedHour, setSelectedHour] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);

  const cities = ["Jakarta", "Bandung", "Semarang", "Surabaya"];
  const [currentTime, setCurrentTime] = useState("");
  const hours = [
    { label: "00:00", value: "00:00:00" },
    { label: "01:00", value: "01:00:00" },
    { label: "02:00", value: "02:00:00" },
    { label: "03:00", value: "03:00:00" },
    { label: "04:00", value: "04:00:00" },
    { label: "05:00", value: "05:00:00" },
    { label: "06:00", value: "06:00:00" },
    { label: "07:00", value: "07:00:00" },
    { label: "08:00", value: "08:00:00" },
    { label: "09:00", value: "09:00:00" },
    { label: "10:00", value: "10:00:00" },
    { label: "11:00", value: "11:00:00" },
    { label: "12:00", value: "12:00:00" },
    // Tambahkan opsi jam lainnya sesuai kebutuhan
  ];
  const apiKey = CONSTANT.API_KEY; // Ganti dengan API key Anda
  const urlCurrent = CONSTANT.URL_CURRENT;
  const urlHours = CONSTANT.URL_HOURS;
  // console.log(apiKey, urlCurrent, urlHours);
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleHourChange = (e) => {
    // setSelectedHour(e.target.value);
    alert("Sorry, we cant retrieve hourly data at this time");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentWeatherResponse = await fetchCurrentWeather();
        const currentWeatherData = await currentWeatherResponse.json();
        setCurrentWeather(currentWeatherData);

        if (currentWeatherData.coord) {
          const hourlyWeatherResponse = await fetchHourlyWeather(
            currentWeatherData.coord.lat,
            currentWeatherData.coord.lon
          );
          const hourlyWeatherData = await hourlyWeatherResponse.json();
          setHourlyWeather(hourlyWeatherData.hourly);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (selectedCity) {
      fetchData();
    }
  }, [selectedCity]);

  const fetchCurrentWeather = () => {
    const url = `${urlCurrent}?q=${selectedCity}&units=metric&appid=${apiKey}`;
    return fetch(url);
  };
  const convertTime = (time) => {
    const timeObj = new Date(`1970-01-01T${time}Z`);
    const timestamp = Math.floor(timeObj.getTime() / 1000);
    return timestamp;
  };
  const fetchHourlyWeather = (lat, lon) => {
    const currentTime = convertTime(selectedHour);
    const url = `${urlHours}?lat=${lat}&lon=${lon}&units=metric&dt=${currentTime}&appid=${apiKey}`;
    return fetch(url);
  };
  console.log(currentWeather);
  return (
    <div className="container text-center">
      <div className="d-flex justify-content-center mt-5">
        <div className="d-block d-md-flex align-items-center gap-3 title">
          The weather in{" "}
          <select
            value={selectedCity}
            className="custom-select"
            onChange={handleCityChange}
          >
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>{" "}
          at{" "}
          <select
            className="custom-select"
            value={selectedHour}
            onChange={handleHourChange}
          >
            <option value="">{currentTime}</option>
            {hours.map((hour, index) => (
              <option key={index} value={hour.value}>
                {hour.label}
              </option>
            ))}
          </select>{" "}
          is {currentWeather?.weather[0].description}
        </div>
      </div>

      {currentWeather && (
        <div className="mt-4">
          <div className="d-flex justify-content-center gap-4 mb-4 ">
            <div>
              <div className="value">{currentWeather.coord.lat}</div>
              <div className="subTitle">Lat</div>
            </div>
            <div>
              <div className="value">{currentWeather.coord.lon}</div>
              <div className="subTitle">Lon</div>
            </div>
          </div>
          {currentWeather.weather[0].main === "Clouds" && (
            <AiOutlineCloud size={90} />
          )}
          {currentWeather.weather[0].main === "Clear" && (
            <TiWeatherSunny size={90} color="#E8DE2A" />
          )}
          {currentWeather.weather[0].main === "Drizzle" && (
            <BsCloudDrizzle size={90} />
          )}
          {currentWeather.weather[0].main === "Rain" && (
            <BsCloudRain size={90} />
          )}
          {currentWeather.weather[0].main === "Thunderstorm" && (
            <BsCloudLightningRain size={90} />
          )}
          {currentWeather.weather[0].main === "Haze" && (
            <BsCloudHaze size={90} />
          )}
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div>
              <div className="value">{currentWeather.weather[0].main}</div>
              <div className="subTitle">Condition</div>
            </div>
            <div>
              <div className="value">
                {currentWeather.weather[0].description}
              </div>
              <div className="subTitle">Description</div>
            </div>
          </div>
          <div className="main-temp">
            {Math.round(currentWeather.main.temp)}°C
          </div>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div className="d-flex gap-3">
              <div>
                <div className="value">{currentWeather.main.temp_min}°C</div>
                <div className="subTitle">Min Temperature</div>
              </div>

              <div>
                <div className="value">
                  {currentWeather.main.temp_max}
                  °C
                </div>
                <div className="subTitle"> Max Temperature </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div className="d-flex gap-3">
              <div>
                <div className="value">
                  {new Date(
                    currentWeather.sys.sunset * 1000
                  ).toLocaleTimeString()}
                </div>
                <div className="subTitle">Sunset</div>
              </div>

              <div>
                <div className="value">
                  {new Date(
                    currentWeather.sys.sunrise * 1000
                  ).toLocaleTimeString()}
                </div>
                <div className="subTitle">Sunrise</div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div className="d-flex gap-3">
              <div>
                <div className="value">{currentWeather.wind.speed} m/s</div>
                <div className="subTitle">Wind Speed</div>
              </div>

              <div>
                <div className="value">{currentWeather.wind.deg}°</div>
                <div className="subTitle">Wind Direction</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {hourlyWeather?.length && (
        <div>
          <h2>Hourly Weather Today</h2>
          {hourlyWeather.map((data, index) => (
            <div key={index}>
              <h3>{new Date(data.dt * 1000).toLocaleTimeString()}</h3>
              <p>Condition: {data.weather[0].main}</p>
              <p>Description: {data.weather[0].description}</p>
              <p>Temperature: {data.temp}°C</p>
              <p>Max Temperature: {data.temp_max}°C</p>
              <p>Min Temperature: {data.temp_min}°C</p>
              <p>Wind Speed: {data.wind_speed} m/s</p>
              <p>Wind Direction: {data.wind_deg}°</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
