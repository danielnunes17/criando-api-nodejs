'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

mongoose.connect('mongodb://mongostore:password@localhost:27017/admin');

const product = require('./models/product')

const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute)
app.use('/products', productRoute);
app.use('/product', product);
app.use('/router', router)

module.exports = app;
