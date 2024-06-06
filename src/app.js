import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import Image from './models/Image';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const newImage = new Image({
    month: req.body.month,
    year: req.body.year,
    img: {
      data: req.file?.buffer,
      contentType: req.file?.mimetype,
    },
  });

  newImage.save()
    .then(() => res.json('Image uploaded successfully'))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
