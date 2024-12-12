import { useState } from "react";
import './app.css';
import icon from'./icon.png';

function App() {
  const [data, setData] = useState(null);
  const [input, setInput] = useState('');
  const [errorValue, setErrorValue] = useState(''); 
  const [notFoundError, setNotFoundError] = useState('');
  
  const KEY = '2eab2e128fa712ffc3bbf4f9c53e275d';

  const formatCustomDate = (dateString) => {
    const date = new Date(dateString);
    
    const daysOfWeek = [
      "воскресенье", "понедельник", "вторник", 
      "среда", "четверг", "пятница", "суббота"
    ];
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    let dayOfWeek = daysOfWeek[date.getDay()];
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    let dayNumberInMonth = Math.floor((date.getDate() - 1) / 7) + 1;

    return `${dayOfWeek} ${dayNumberInMonth} ${month} ${year} года`;
  };

  const getWeather = () => {
    if (!input.trim()) {
      setErrorValue("Заполните поле");
      setNotFoundError('');
      return;
    }

    setErrorValue(''); 
    setNotFoundError(''); 

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=${KEY}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.cod === '404') {
          setNotFoundError("Город не найден");
          setData(null);
        } else if (result.list) {
          const daysWeatherFour = result.list.filter((_, i) => i % 8 === 0).slice(0, 4);
          setData({ city: result.city, list: daysWeatherFour });
        }
      })
      .catch((error) => {
        console.log("Ошибка при получении данных о погоде:", error);
        setData(null);
        setNotFoundError("Ошибка при загрузке данных");
      });
  };

  return (
    <div className="parent">
      <div className="container-input">
      <input
        type="text"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="Введите название города"
      />
      <button onClick={getWeather}>
        <img src={icon} alt="icon" width={15}/>
      </button>
      </div>

      {errorValue && <p style={{ color: 'red' }}>{errorValue}</p>} 
      {notFoundError && <p style={{ color: 'red' }}>{notFoundError}</p>} 

      {data && (
        <div className="parent-data">
          {data.list.map((items, index) => {
            const customDate = formatCustomDate(items.dt_txt);
            return (
              
              <div className="container" key={index}>
                <h1>{data.city.name}</h1>
                <div className="items1">
              
                   <img
                   src={`http://openweathermap.org/img/wn/${items.weather[0].icon}@2x.png`}
                   alt={items.weather[0].description}
                 />
                <p> {items.main.temp} °C</p>
                </div>
                <div className="items2">
                  <p> {customDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;