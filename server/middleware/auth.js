import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Please login first.' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'scriptflow-secret').userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid login session.' });
  }
}
