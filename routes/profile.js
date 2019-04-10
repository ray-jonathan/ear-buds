// route handlers that will plug-n-play to controller functions

const express = require('express');
const Router = express.Router;
const profileRouter = Router();
const {getProfile} = require('../controllers/profile'); // object of functions from controllers page

profileRouter.get('*', getProfile);

module.exports = profileRouter;