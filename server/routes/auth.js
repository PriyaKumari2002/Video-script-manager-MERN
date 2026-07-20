import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const createToken = userId => jwt.sign({ userId }, process.env.JWT_SECRET || 'scriptflow-secret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
  if (password.length < 6) return res.status(400).json({ message: 'Password should be at least 6 characters.' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered.' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: createToken(user._id), user: { name: user.name, email: user.email } });
});
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Wrong email or password.' });
  res.json({ token: createToken(user._id), user: { name: user.name, email: user.email } });
});
export default router;
