import { Router } from 'express';
import Script from '../models/Script.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

const handleError = (res, error) => {
  res.status(400).json({ message: error.message || 'Request failed.' });
};

router.get('/', async (req, res) => {
  try {
    const { q = '', status } = req.query;
    const filter = { owner: req.userId, ...(status ? { status } : {}), ...(q ? { $text: { $search: q } } : {}) };
    res.json(await Script.find(filter).sort({ updatedAt: -1 }));
  } catch (error) {
    handleError(res, error);
  }
});
router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Script.create({ ...req.body, owner: req.userId }));
  } catch (error) {
    handleError(res, error);
  }
});
router.patch('/:id', async (req, res) => {
  try {
    res.json(await Script.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, req.body, { new: true, runValidators: true }));
  } catch (error) {
    handleError(res, error);
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Script.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    res.status(204).end();
  } catch (error) {
    handleError(res, error);
  }
});
export default router;
