import express from 'express';
import carsRouter from './routes/cars.js';
import { promises as fs } from 'fs';

global.fileName = 'car-list2.json';
const { readFile, writeFile } = fs;
const app = express();
app.use(express.json());
app.use('/brand', carsRouter);

app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        console.log('MY-API-CARS STARTED');
    } catch (error) {
        console.log(error);
    }
});
