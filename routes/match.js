// route handlers that will plug-n-play to controller functions

const express = require('express');
const Router = express.Router;
const matchRouter = Router();
const {getMatch} = require('../controllers/match'); // object of functions from controllers page

matchRouter.get('*', getMatch);

module.exports = matchRouter;