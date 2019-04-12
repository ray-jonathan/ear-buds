// route handlers that will plug-n-play to controller functions

const express = require('express');
const Router = express.Router;
const messagesRouter = Router();
const {getMessages, addMessage} = require('../controllers/messages'); // object of functions from controllers page

messagesRouter.get('*', getMessages);
messagesRouter.post('*', addMessage);

module.exports = messagesRouter;