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
        for (const item of data) {
            console.log(`${item.brand} ${item.models.length}`);
        }
        data = data.sort((a, b) => a.qtdModels - b.qtdModels);

        await writeFile(global.fileName, JSON.stringify(data, null, 4));

        res.send(data);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retorna a marcar que tem mais modelos
router.get('/moreModels', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        data.sort((a, b) => b.models.length - a.models.length);
        res.send(data[0].brand);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retorna a marcar que tem menos modelos
router.get('/lessModels', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        data.sort((a, b) => a.models.length - b.models.length);
        res.send(data[0].brand);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Retorna uma lista com X marcas que mais possuem modelos, X e um parametro passado na uri
router.get('/listMoreModels/:value', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        data.sort((a, b) => {
            return (
                b.models.length - a.models.length ||
                a.brand.localeCompare(b.brand)
            );
        });
        const listMoreModels = [];

        for (let i = 0; i < req.params.value; i++) {
            let models = `${data[i].brand} - ${data[i].models.length}`;
            listMoreModels.push(models);
        }
        res.send(listMoreModels);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

//Retorna uma lista com X marcas que menos possuem modelos, X e um parametro passado na uri
router.get('/listLessModels/:value', async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        data.sort((a, b) => {
            return (
                a.models.length - b.models.length ||
                a.brand.localeCompare(b.brand)
            );
        });
        const listLessModels = [];

        for (let i = 0; i < req.params.value; i++) {
            let models = `Brand ${data[i].brand} - ${data[i].models.length}`;
            listLessModels.push(models);
        }

        res.send(listLessModels);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Retorna uma lista de modelos de acordo com o nome da marca passada via json
router.post('/listModel', async (req, res) => {
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
