const { celebrate, Segments, Joi } = require("celebrate");
const router = require("express").Router();

const controller = require("./subscription-controller");
const authMiddleware = require("../../middlewares/auth");

router.get("/", authMiddleware, controller.index);

router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string()
        .required()
        .email(),
      signup: Joi.boolean().required()
    })
  }),
  controller.create
);

module.exports = router;
