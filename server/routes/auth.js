import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const createToken = userId => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name?.trim() || !normalizedEmail || !password) return res.status(400).json({ message: 'All fields are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password should be at least 6 characters.' });
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'Email already registered.' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: createToken(user._id), user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Could not create account.' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Wrong email or password.' });
    res.json({ token: createToken(user._id), user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Could not log in.' });
  }
});
export default router;
