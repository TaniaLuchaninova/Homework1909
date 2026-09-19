const express = require('express');
const moment = require('moment');

const app = express();
const port = 8000;

function getCurrentDay() {
    return moment().format('dddd');
}

function getCurrentMonth() {
    return moment().format('MMMM');
}

function getCurrentYear() {
    return moment().format('YYYY');
}

app.get('/timestamp', (req, res) => {
    res.json({
        day: getCurrentDay(),
        month: getCurrentMonth(),
        year: getCurrentYear()
    });
});

const products = [
  {id: 1, name: 'Laptop', price: 1500, category: 'electronics'},
  {id: 2, name: 'Tablet', price: 800,  category: 'electronics'},
  {id: 3, name: 'Table', price: 250,  category: 'furniture'},
  {id: 4, name: 'Bed', price: 1200, category: 'furniture'},
  {id: 5, name: 'Headphones', price: 150,  category: 'electronics'}
]

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/stats', (req, res) => {
  res.json({
    uptime: process.uptime(),
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});




app.get('/products', (req, res) => {
    const { take, category } = req.query
     let result = [...products]

    if (category !== undefined) {
        result = result.filter((product) => product.category === category)
    }
    if (take !== undefined) {
        const takeNum = parseInt(take)

        if (Number.isNaN(takeNum) || takeNum <= 0) {
            return res.status(400).json({
                ok: false,
                description: "Query parameter 'take' is incorrect!"
            })
        }
        result = result.slice(0, takeNum)
    }
    res.status(200).json({
        products: result
    })
})

app.get('/products/:id', (req, res) => {
    const { id } = req.params
    const idNum = parseInt(id)

    if (Number.isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({
            ok: false,
            description: "Route parameter 'id' is incorrect!"
        })
    }
    const foundProduct = products.find((product) => product.id === idNum)
    if (!foundProduct) {
        return res.status(404).json({
            ok: false,
            description: "Product not found"
        })
    }
    res.status(200).json({
        result: foundProduct
    })
})


let products = [];

app.post('/products', (req, res) => {
  const { name, price, category, image } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(422).json({ error: 'Invalid product data' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(422).json({ error: 'Invalid product data' });
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(422).json({ error: 'Invalid product data' });
  }

  const exists = products.some(p => p.name === name);
  if (exists) {
    return res.status(409).json({ error: 'Conflict' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category,
    image: image || ''
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
    console.log(`Поточна дата: ${getCurrentDay()}, ${getCurrentMonth()} ${getCurrentYear()}`);
});