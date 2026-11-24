import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { HttpError, asyncHandler, isEmail, validate } from '../utils/http.js';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, passwordConfirmation } = req.body;
    const first = String(firstName || '').trim();
    const last = String(lastName || '').trim();

    validate({
      firstName: !first ? 'First name is required.' : first.length > 120 ? 'First name is too long.' : '',
      lastName: !last ? 'Last name is required.' : last.length > 120 ? 'Last name is too long.' : '',
      email: !isEmail(email) ? 'Enter a valid email address.' : '',
      password: String(password || '').length < 8 ? 'Use at least 8 characters for your password.' : '',
      passwordConfirmation: password !== passwordConfirmation ? 'The passwords do not match.' : '',
    });

    if (await User.exists({ email: String(email).toLowerCase().trim() })) {
      throw new HttpError(422, 'That email is already registered.', { email: 'That email is already registered.' });
    }

    // Public sign-up always creates a customer; admins are promoted from the admin panel.
    const user = await User.create({ name: `${first} ${last}`, email, password, role: 'user' });
    res.status(201).json({ token: signToken(user), user });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    validate({
      email: !isEmail(email) ? 'Enter a valid email address.' : '',
      password: !password ? 'Please enter your password.' : '',
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
