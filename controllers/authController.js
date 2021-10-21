/* eslint-disable require-jsdoc */
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

async function login(req, res) {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if (!user) {
    return res.status(400).json({message: 'No user found!'});
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({message: 'Wrong password!'});
  }

  const token = jwt.sign({id: user.id, email}, secret, {
    expiresIn: 60 * 60 * 12,
  });
  res.status(200).json({jwt_token: token});
}

async function register(req, res) {
  const {email, password, role} = req.body;

  const userWithSameName = await User.findOne({email});
  if (userWithSameName) {
    return res
        .status(400)
        .json({message: 'User with this username already exists'});
  }

  try {
    await User.create({
      role,
      email,
      password: bcrypt.hashSync(password, 7),
    });
    res.status(200).json({message: 'Profile created successfully'});
  } catch (e) {
    console.log(e);
    res.status(500).json({message: e.message});
  }
}

async function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(400).json({message: 'No token provided'});
  }

  const token = req.headers.authorization.split(' ')[1] ?
  req.headers.authorization.split(' ')[1] :
  req.headers.authorization;


  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
  } catch (e) {
    return res.status(400).json({message: 'Unautorized'});
  }

  const user = await User.findOne({_id: req.userId});
  if (!user) {
    return res.status(400).json({message: 'Unautorized'});
  }

  next();
}

module.exports = {
  login,
  register,
  verifyToken,
};
