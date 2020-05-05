import subscriberDao from './subscriber.dao';
import emailService from '../../services/email/email.service';
import emailMessageTypes from '../../services/email/email.types';
import { buildResponse as Response } from '../../helpers/response';

class SubscriberController {
  static async postSubscriber(req, res) {
    try {
      const email = req.body.email.trim();
      const active = req.body.active || true;
      if (await subscriberDao.getByEmail(email)) {
        return Response(res, 409, 'E-mail já inscrito');
      }
      await subscriberDao.post({ email, active });

      const unsubscribeLink = 'https://google.com';
      await emailService.sendMail(
        email,
        emailMessageTypes.SUBSCRIBER,
        null,
        unsubscribeLink
      );
      return Response(res, 201, `E-mail ${email} inscrito com sucesso`);
    } catch (error) {
      return Response(res, 500, `Erro ao cadastrar inscrito: ${error}`);
    }
  }

  static async getSubscribers(req, res) {
    try {
      const subscribers = await subscriberDao.getAll();
      if (subscribers && subscribers.length > 0) {
        return Response(res, 200, 'Inscritos encontrados', subscribers);
      }
      return Response(res, 404, 'Nenhum inscrito encontrado', null, true);
    } catch (error) {
      return Response(
        res,
        500,
        `Erro ao buscar inscritos: ${error}`,
        null,
        true
      );
    }
  }
}

export default SubscriberController;