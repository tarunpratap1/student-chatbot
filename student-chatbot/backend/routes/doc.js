import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Doc from '../models/Doc.js';
import auth from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/upload/pdf', auth, upload.single('file'), async (req, res) => {
  const data = await pdfParse(req.file.buffer);
  const text = data.text.slice(0, 200000);
  const doc = await Doc.create({ userId: req.uid, filename: req.file.originalname, text });
  res.json({ id: doc._id, filename: doc.filename });
});

export default router;
