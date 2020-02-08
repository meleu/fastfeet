import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  // create a new recipient
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation has been failed' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code
    });
  }

  // change recipient's info
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation has been failed' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code
    });
  }
}

export default new RecipientController();
