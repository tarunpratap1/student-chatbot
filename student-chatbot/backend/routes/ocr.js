import express from 'express';
import auth from '../middleware/auth.js';
import Tesseract from 'tesseract.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { imageBase64 } = req.body;
  const { data } = await Tesseract.recognize(imageBase64, 'eng');
  res.json({ text: data.text });
});

export default router;
