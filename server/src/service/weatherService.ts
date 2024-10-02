import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  temp: number;
  description: string;
  humidity: number;

  constructor(city: string, temp: number, description: string, humidity: number) {
    this.city = city;
    this.temp = temp;
    this.description = description;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;  
  private apiKey: string;
  private cityName: string;
  private weatherURL: string;
  private forecast: any[];

  constructor() {
    this.baseURL = process.env.API_BASE_URL as string;
    this.apiKey = process.env.API_KEY as string;
    this.cityName = '';
    this.weatherURL = process.env.API_WEATHER_URL as string;
    this.forecast = [];
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}q=${query}&limit=1&appid=${this.apiKey}`;
    console.log("URL",url)
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data = await response.json();
      console.log("+++++++FIVE day forecast",data.list,"++++++++++++++++++")
      console.log(data.city,"DATA fetch location DAta")
      data.list.forEach((day: any) => {
        if  (day.dt_txt.includes("12:00:00")) {
          console.log("DAY",day)
          this.forecast.push(day);
        }
      })
      return data.city.coord;
    } catch (error) {
      throw new Error("Failed to fetch location data");
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    console.log("Locationdata",locationData)
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.cityName}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.weatherURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    console.log(query,"QUERY")
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any>   {
    const query = this.buildWeatherQuery(coordinates);
    console.log("FETCH WEATHER DATA",query)
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return await response.json();
    }
    catch (error) {
      throw new Error("Failed to fetch weather data");
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, name: city } = response; // Destructure city from response
    const { temp: temp, humidity } = main;
    const { description } = weather[0];
    console.log(response,response.weather)
    return new Weather(
      city,
      temp,
      description,
      humidity); // Pass city to Weather constructor
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    forecastArray.push(currentWeather);
    console.log("CURRENT WEATHER",currentWeather)
    console.log("WEATHER DATA",weatherData)
    weatherData.forEach((day) => {
      console.log(day)
      const { city, temp, description, icon } = day;
      forecastArray.push(new Weather(city, temp, description, icon));
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log("COORDINATES",coordinates)  
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    console.log(weatherData, "parse current weather")
    console.log(currentWeather, "current weather")
    const forecastArray = this.buildForecastArray(currentWeather, this.forecast);
   console.log(forecastArray,"FORECAST ARRAY")
    return forecastArray;
  }
}

export default new WeatherService();
