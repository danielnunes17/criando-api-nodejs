'use strict';
const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
  return await jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}
exports.decodeToken = async (token) => {
  var data = await jwt.verify(token, global.SALT_KEY);
}
exports.authorize = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(401).json({
      message: 'Access restricted'
    });
  } else {
    jwt.verify(token, global.SALT_KEY, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: 'Invalid token'
        });
      } else {
        next();
      }
    });
  }
};
exports.isAdmin = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(401).json({
      message: 'Invalid token'
    });
  } else {
    jwt.verify(token, global.SALT_KEY, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: 'Invalid token'
        });
      } else {
        if (decoded.roles.includes('admin')) {
          next();
        } else {
          res.status(403).json({
            message: 'Functionality restricted to administrators'
          });
        }

      }
    });
  }
};
