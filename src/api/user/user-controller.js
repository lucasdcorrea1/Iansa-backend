const mailer = require("../../modules/mailer");
const authRepository = require("../auth/auth-repository");
const jwtService = require("../../helpers/jwtServices");
const validations = require("../../util/validations/validate");
const Env = require("../../config/environment");

module.exports = {
  async create(req, res) {
    try {
      const userData = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        password: req.body.password
      };
      const { name } = userData;

      if (!validations.validateEmailAddress(userData.email))
        return res.status(400).send({
          error: "E-mail inválido"
        });

      const user = await authRepository.get({ email: userData.email });
      if (user)
        return res.status(400).send({
          error: "Usuário já cadastrado"
        });

      const userId = await authRepository.post(userData);
      const token = await jwtService.generateToken({
        id: userId
      });
      const link = "https://github.com/lucasdcorrea1";

      mailer.sendMail(
        {
          to: `${userData.email}`,
          bc: Env.gmail_user,
          from: '"Lucas, of IANSA" <ti@iansa.org.br>',
          subject: `Hi ${name}, please confirm your email!`,
          template: "auth/verifyemail",
          context: {
            name,
            link
          }
        },
        err =>
          res.status(503).send({
            message: err.message
          })
      );

      return res.status(200).send({
        token
      });
    } catch (error) {
      res.status(400).send({
        error: `Erro oa realizar cadastro - ${error}`
      });
    }
    return res.status(500).send(JSON.stringify("Erro ao cadastrar usuario"));
  }
};
