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

app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
    console.log(`Поточна дата: ${getCurrentDay()}, ${getCurrentMonth()} ${getCurrentYear()}`);
});