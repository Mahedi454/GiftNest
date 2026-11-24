import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError, asyncHandler, isEmail, validate } from '../utils/http.js';

const router = Router();
router.use(requireAuth);

router.put(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, phone = '', address = '' } = req.body;
    validate({
      name: !String(name || '').trim() ? 'The name field is required.' : '',
      email: !isEmail(email) ? 'Enter a valid email address.' : '',
      phone: String(phone).length > 30 ? 'The phone may not be longer than 30 characters.' : '',
    });

    const normalizedEmail = String(email).toLowerCase().trim();
    const taken = await User.exists({ email: normalizedEmail, _id: { $ne: req.user._id } });
    if (taken) throw new HttpError(422, 'That email is already in use.', { email: 'That email is already in use.' });

    Object.assign(req.user, { name, email: normalizedEmail, phone, address });
    await req.user.save();
    res.json({ user: req.user });
  }),
);

router.put(
  '/password',
  asyncHandler(async (req, res) => {
    const { currentPassword, password, passwordConfirmation } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    validate({
      currentPassword: !currentPassword || !(await user.matchPassword(currentPassword)) ? 'The current password is incorrect.' : '',
      password: String(password || '').length < 8 ? 'The password must be at least 8 characters.' : '',
      passwordConfirmation: password !== passwordConfirmation ? 'The password confirmation does not match.' : '',
    });

    user.password = password;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  }),
);

router.delete(
  '/',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('+password');
    if (!req.body.password || !(await user.matchPassword(req.body.password))) {
      throw new HttpError(422, 'The password is incorrect.', { password: 'The password is incorrect.' });
    }
    if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) <= 1) {
      throw new HttpError(422, 'You cannot delete the only administrator account.');
    }
    // Past orders stay for the store's records; only the account is removed.
    await user.deleteOne();
    res.json({ message: 'Account deleted.' });
  }),
);

export default router;
