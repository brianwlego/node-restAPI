const User = require('../models/user');
const {validationResult} = require('express-validator/check')
const bcrypt = require('bcryptjs')


exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  bcrypt.hash(req.body.password, 12)
    .then(hashedPW => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPW
      })
      return user.save()
    })
    .then(result => {
      res.status(201).json({msg: "User created!", userId: result._id})
    })
    .catch(error => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    })
}