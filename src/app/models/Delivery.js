import Sequelize, { Model } from 'sequelize';
import Status from '../etc/DeliveryStatus';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.canceled_at) {
              return Status.canceled;
            }
            if (this.end_date) {
              return Status.finished;
            }
            if (this.start_date) {
              return Status.initiated;
            }
            return Status.registered;
          }
        }
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient'
    });
    this.belongsTo(models.User, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman'
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature'
    });
  }
}

export default Delivery;
