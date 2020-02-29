import User from '../models/User';
import Role from '../etc/Roles';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (!user || user.role !== Role.admin) {
    return res.status(401).json({ error: 'Available for admins only' });
  }
  return next();
};
