import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import User from '../models/User';

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

    const user = await User.findByPk(req.userId);
    if (!user || user.role !== 0) {
      // role === 0 means admin. TODO: handle roles without "magic numbers"
      return res.status(401).json({ error: 'Unauthorized' });
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

    const user = await User.findByPk(req.userId);
    if (!user || user.role !== 0) {
      // role === 0 means admin. TODO: handle roles without "magic numbers"
      return res.status(401).json({ error: 'Unauthorized' });
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
