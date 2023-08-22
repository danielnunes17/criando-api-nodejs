'use strict';
const repository = require('../repositories/order-repository')
const guid = require('guid')
const authService = require('../service/auth-service');
exports.get = async (req, res, next) => {
  try {
    var data = await repository.get();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error'
    });
  }
}
exports.post = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const data = await authService.decodeToken(token);

    await repository.create({
      customer: data.id,
      number: guid.raw().substring(0, 6),
      items: req.body.items
    })
    res.status(201).send({
      message: 'Order created successfully'
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error creating order'
    });
  }
}
