import { Router, type Request, type Response } from 'express';
// import { get } from 'node:http';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      throw new Error('City is required');
    }
    //TODO: get weather data from city name
    const weatherData = await WeatherService.getWeatherData(city);

    // TODO: save city to search history
    await HistoryService.addCity(req.body.city);

  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve weather data" });
  }
  
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const city = await HistoryService.getHistory();
    res.json(city);
  } catch (error) {}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
