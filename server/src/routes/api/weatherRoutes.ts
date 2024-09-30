import { Router, type Request, type Response } from 'express';
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
    const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: save city to search history
    await HistoryService.addCity(req.body.city);
    res.json(weatherData);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve weather data" });
  }
  
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const city = await HistoryService.getCities();
    console.log(city);
    res.json(city);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to retrieve search history" });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({msg: 'City ID is required'});
    }
    await HistoryService.removeCity(req.params.id);
    res.json({msg: 'City removed from search history'});
  } catch (error) {
    res.status(500).json({ error: "Failed to remove city from search history" });
  }
});

export default router;
