const User = require('../models/user');
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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

exports.login = (req, res, next) => {
  let loadedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user){
        const error = new Error('User with submitted email could not be found.')
        error.statusCode = 404
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(isEqual => {
      if (!isEqual){
        const error = new Error('Incorrect password')
        error.statusCode = 401;
        throw error;
      } 
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        }, 
        'secret', 
        {expiresIn: '1h'}
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() })
    })
    .catch(error => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    })
}