import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import User from '../models/User';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Roles from '../etc/Roles';
import Mail from '../../lib/Mail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation has been failed' });
    }

    // TODO: check if there's a recently created delivery with same product and
    // recipient_id to avoid duplication

    const { recipient_id, deliveryman_id, product } = req.body;

    const deliveryman = await User.findByPk(deliveryman_id, {
      attributes: ['name', 'email', 'role']
    });
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }
    if (deliveryman && deliveryman.role !== Roles.deliveryman) {
      return res
        .status(400)
        .json({ error: 'Given user ID is not a deliveryman' });
    }

    const recipient = await Recipient.findByPk(recipient_id, {
      attributes: ['name']
    });
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const delivery = await Delivery.create({
      product,
      recipient_id,
      deliveryman_id
    });

    if (delivery) {
      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'Nova entrega a ser despachada',
        text: 'Você tem uma nova entrega para ser despachada.'
      });
    }

    return res.json(delivery);
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name']
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name']
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url']
        }
      ],
      attributes: [
        'id',
        'product',
        'status',
        'start_date',
        'end_date',
        'signature_id',
        'canceled_at'
      ]
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const delivery = await Delivery.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: User,
          as: 'deliveryman',
          attributes: ['id', 'name']
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name']
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url']
        }
      ],
      attributes: [
        'id',
        'product',
        'status',
        'start_date',
        'end_date',
        'signature_id',
        'canceled_at'
      ]
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) {
      return res
        .status(404)
        .json({ error: 'Given delivery ID does not exist' });
    }

    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation has been failed' });
    }

    if (req.body.recipient_id) {
      const recipient = await Recipient.findByPk(req.body.recipient_id, {
        attributes: ['name']
      });
      if (!recipient) {
        return res
          .status(400)
          .json({ error: 'Given recipient ID does not exist' });
      }
    }

    if (req.body.deliveryman_id) {
      const deliveryman = await User.findByPk(req.body.deliveryman_id, {
        attributes: ['name', 'role']
      });
      if (!deliveryman) {
        return res
          .status(400)
          .json({ error: 'Given deliveryman ID does not exist' });
      }
      if (deliveryman.role !== Roles.deliveryman) {
        return res.status(400).json({
          error: `User ID ${req.body.deliveryman_id} is not a deliveryman`
        });
      }
      // TODO: if deliveryman has been changed, send an email to the new one.
    }

    const { product, deliveryman_id, recipient_id } = await delivery.update(
      req.body
    );

    return res.json({ product, deliveryman_id, recipient_id });
  }

  async delete(req, res) {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery.destroy();
    // TODO: should I check if this delivery has a signature_id and delete it?

    return res.json({
      message: `Delivery ID ${id} has been successfully removed`
    });
  }
}

export default new DeliveryController();
