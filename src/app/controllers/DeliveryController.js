import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import User from '../models/User';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Roles from '../etc/Roles';

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

    // TODO: send email to the deliveryman

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

  update(req, res) { }

  delete(req, res) { }
}

export default new DeliveryController();
