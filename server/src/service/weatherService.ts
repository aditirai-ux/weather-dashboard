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
  icon: string;

  constructor(city: string, temp: number, description: string, icon: string) {
    this.city = city;
    this.temp = temp;
    this.description = description;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY;
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const { baseURL, apiKey, cityName } = this;
    return `${baseURL}/geocode/v1/json?q=${cityName}&key=${apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { baseURL, apiKey } = this;
    const { lat, lon } = coordinates;
    return `${baseURL}/weather/1.0/report.json?product=current&latitude=${lat}&longitude=${lon}&key=${apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city, temp, description, icon } = response.data.current_condition[0];
    return new Weather(city, temp, description, icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    forecastArray.push(currentWeather);
    weatherData.forEach((day) => {
      const { city, temp, description, icon } = day;
      forecastArray.push(new Weather(city, temp, description, icon));
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.data.weather);
    return forecastArray;
  }
}

export default new WeatherService();
