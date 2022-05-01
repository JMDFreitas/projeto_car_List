import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

// Cria o campo qtdModels para cada item do array e ordena de forma crescente pela qtdModels
router.get('/', async (req, res) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));

        for (let i = 0; i < data.length; i++) {
            data[i] = { qtdModels: data[i].models.length, ...data[i] };
        }
        data = data.sort((a, b) => a.qtdModels - b.qtdModels);

        await writeFile(global.fileName, JSON.stringify(data, null, 4));

        res.send(data);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retorna a marcar que tem mais modelos
router.get('/brand/moreModels', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const moreModels = `Brand - ${data[data.length - 1].brand}`;

        res.send(moreModels);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retorna a marcar que tem menos modelos
router.get('/brand/lessModels', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const lessModels = `Brand - ${data[0].brand}`;

        res.send(lessModels);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Retorna uma lista com X marcas que mais possuem modelos, X e um parametro passado na uri
router.get('/brand/listMoreModels/:value', async (req, res) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        data = data.sort((a, b) => b.qtdModels - a.qtdModels);
        const listMoreModels = [];

        for (let i = 0; i < req.params.value; i++) {
            let models = `Brand ${data[i].brand} - ${data[i].qtdModels}`;
            listMoreModels.push(models);
        }
        listMoreModels.sort((a, b) => a.brand - b.brand);
        res.send(listMoreModels);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Retorna uma lista com X marcas que menos possuem modelos, X e um parametro passado na uri
router.get('/brand/listLessModels/:value', async (req, res) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        const listLessModels = [];

        for (let i = 0; i < req.params.value; i++) {
            let models = `Brand ${data[i].brand} - ${data[i].qtdModels}`;
            listLessModels.push(models);
        }

        res.send(listLessModels);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retorna uma lista de modelos de acordo com o nome da marca passada via json
router.post('/brand/listModel', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let brandCar = req.body;
        const listModels = [];

        const models = data.find(
            brand => brand.brand.toLowerCase() === brandCar.brand.toLowerCase()
        );

        if (models) {
            listModels.push(models);
            res.send(listModels[0].models);
        } else {
            res.send(listModels);
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
