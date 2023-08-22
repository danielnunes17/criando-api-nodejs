'use strict';
const repository = require('../repositories/product-repository')
const guid = require('guid');
var config = require('../config');

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
exports.getBySlug = async (req, res, next) => {
  try {
    var data = await repository.getBySlug(req.params.slug);
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
exports.getByTag = async (req, res, next) => {
  try {
    var data = await repository.getByTag(req.params.tag);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({
      message: 'Error getting product from repository'
    });
  }
}
exports.post = async (req, res, next) => {
  try {
    await repository.create(req.body)
    res.status(201).send({
      message: 'Product created successfully'
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error creating product'
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
