import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { HttpError, asyncHandler, isEmail, validate } from '../utils/http.js';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;
    validate({
      name: !String(name || '').trim() ? 'The name field is required.' : '',
      email: !isEmail(email) ? 'Enter a valid email address.' : '',
      password: String(password || '').length < 8 ? 'The password must be at least 8 characters.' : '',
      passwordConfirmation: password !== passwordConfirmation ? 'The password confirmation does not match.' : '',
    });

    if (await User.exists({ email: String(email).toLowerCase().trim() })) {
      throw new HttpError(422, 'That email is already registered.', { email: 'That email is already registered.' });
    }

    // Public sign-up always creates a customer; admins are promoted from the admin panel.
    const user = await User.create({ name, email, password, role: 'user' });
    res.status(201).json({ token: signToken(user), user });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    validate({
      email: !isEmail(email) ? 'Enter a valid email address.' : '',
      password: !password ? 'The password field is required.' : '',
    });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      throw new HttpError(401, 'These credentials do not match our records.', {
        email: 'These credentials do not match our records.',
      });
    }
    res.json({ token: signToken(user), user });
  }),
);

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

export default router;
