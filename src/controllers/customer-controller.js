'use strict';
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../service/email-service');
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
exports.getById = async (req, res, next) => {
  try {
    var data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error'
    });
  }
}
exports.post = async (req, res, next) => {
  try {
    await repository.create({
      name: req.body.name,
      email: req.body.email,
      cpf: req.body.cpf,
      password: md5(req.body.password + global.SALT_KEY),
      roles: ["user"]
    });
    emailService.send(
      req.body.email,
      'Bem vindo',
      global.EMAIL_TMPL.replace('{0}', req.body.name));

    res.status(201).send({
      message: 'Customer created successfully'
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error creating customer'
    });
  }
}
exports.put = async (req, res, next) => {
  await repository.update(req.params.id, req.body)
  try {
    res.status(200).send({
      message: 'success'
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error updating'
    });
  }
}
exports.delete = async (req, res, next) => {
  try {
    repository.delete(req.body.id)
    res.status(200).send({
      message: 'Deleted'
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error deleting repository'
    });
  }
}
exports.authenticate = async (req, res, next) => {
  try {
    const customer = await repository.authenticate({
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY),
    });
    if (!customer) {
      res.status(404).send({ message: 'User or key invalid' });
      return;
    }
    const token = await authService.generateToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles
    });
    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name
      }
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error creating customer'
    });
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const data = await authService.decodeToken(token);
    const customer = await repository.getById(data.id);

    if (!customer) {
      res.status(404).send({ message: 'Client not found' });
      return;
    }
    const tokenData = await authService.generateToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      roles: customer.roles,
    });
    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name
      }
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error creating customer'
    });
  }
}
