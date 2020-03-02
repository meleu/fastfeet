import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import Roles from '../../lib/Roles';

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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation has been failed' });
    }

    const { email } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    if (user && user.role !== Roles.deliveryman) {
      return res.status(400).json({ error: 'user is not a deliveryman' });
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'email is already in use' });
      }
    }

    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deliveryman = await User.findByPk(id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'user not found' });
    }

    if (deliveryman && deliveryman.role !== Roles.deliveryman) {
      return res.status(400).json({ error: 'user is not a deliveryman' });
    }

    await deliveryman.destroy();
    // TODO: check if .destroy() succeded
    // TODO: remove the deliveryman's avatar?

    return res.json({ message: `user ID ${id} has been successfully removed` });
  }
}

export default new DeliverymanController();
