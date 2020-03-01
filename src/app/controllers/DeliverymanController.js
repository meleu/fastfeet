import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import Roles from '../etc/Roles';

class DeliverymanController {
  async store(req, res) {
    // TODO: aplicar DRY, pois isso aqui é uma repetição do UserController.store
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation has been failed' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'email is already in use' });
    }

    req.body.role = Roles.deliveryman;
    const { id, name, email, role } = await User.create(req.body);

    return res.json({ id, name, email, role });
  }

  async index(req, res) {
    const deliverymen = await User.findAll({
      where: { role: Roles.deliveryman },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    return res.json(deliverymen);
  }

  async show(req, res) {
    const deliveryman = await User.findOne({
      where: {
        id: req.params.id,
        role: Roles.deliveryman
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    return res.json(deliveryman);
  }

  update(req, res) { }

  delete(req, res) { }
}

export default new DeliverymanController();
