'use strict'
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const router = express.Router();
const controller = require('../../api/subscription/subscriptionController');
const authMiddleware = require('../../middlewares/auth');

router.get("/", authMiddleware, controller.index);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    signup: Joi.boolean().required(),
  })
}), controller.create);

module.exports = router;